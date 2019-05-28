const groupDb = require('../helpers/groupModel');
const groupMembersDb = require('../helpers/groupMembersModel');
const itemDb = require('../helpers/itemModel');
const userDb = require('../helpers/userModel');
const server = require('../api/server');

const checkUser = (req, res, next) => {
    /**
     * First we need to check the database for a user with the email generated in 
     * req.user by the checkJwt middleware. The checkJwt middleware stores the id token's
     * user information in req.user for usage in concurrent requests.
     * 
     * It is important to get the email from checkJwt's req.user instead of allowing users to 
     * pass their own emails in req.body, as these could be spoofed.
     * 
     * We can reasonably assume that the token generated by auth0 is a valid representation
     * of the user making the requests, and that its decoded values are legitimate.
     */

    userDb.getIdByEmail(req.user.email).then(id => { 
        if(!id || id.length === 0){
            if(req.originalUrl === '/api/user/check/getid'){
                return next(); // generate user if no user found
            } else {
                return res.status(403).json({warning: `You do not have permission to do that.`})
            }
        } else {
            // console.log('id[0].id: ', id[0].id);
            return routeCheck(req, res, next, id[0].id); // if a valid user ID is found, pass it to the routeChecker
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `An internal server error has occured.`})
    })
}
/**
 * We can now track the ID of the user making requests with @param userId 
 * and ensure they have permissions to perform actions on different API Routes
 */

// declare this as async since it is called within a promise above in checkUser
async function routeCheck(req, res, next, userId){
    // console.log(`req.baseUrl: ${req.baseUrl}\nreq.url: ${req.url}`);
    // console.log(`userId: ${userId}`);
    // console.log(req);
    // console.log('req.url', req.url);
    // console.log('baseUrl', req.baseUrl);
    // console.log('originalUrl', req.originalUrl);
    // console.log('req method', req.method);
    // console.log("userId: ", userId);
    // console.log('_parsedUrl', req._parsedUrl)
    // console.log('req params', req.params)

    /**
     * Protect User Groups @ /api/group/user/:id
     * Ensure that only the self-same user can view/update their user group information
     * This way no other users can scrape the API and view another user's group information
     *  @TODO Expand this to account for moderator requests
     * 
     * */


    if(req.originalUrl === `/api/group/user/${req.params.id}`){
        let paramId = Number(req.params.id);
        if(userId !== paramId){
            return res.status(403).json({warning: `You are not allowed to do that.`})
        } else if(userId === paramId){
            return next();
        }
    }
    

    /**
     * Protect Group Profiles
     * Ensures that only members of a group can see that group's profile information
     */

    if(req.originalUrl === `/api/group/${req.params.id}` && req.method === 'GET'){
        
        // // query the db for all users in that group
        let paramId = Number(req.params.id);
        groupMembersDb.getByGroup(paramId).then(members => {
            // console.log('members', members);
            let member = members.filter(m => {
                return m.userID === userId;
            });

            if(member.length === 0){
                return res.status(403).json({warning: `You do not have permissioon to do that.`})
            } else {
                return next();
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Internal server error.`})
        })
    }

    /**
     * Protect User Profiles
     * Ensures that only self-same users can modify their profile information or
     * delete their accounts (@NOTE strict protection for UPDATE/DELETE requests,
     * GET requests should be managed individually for public profile schemas,
     * and CREATE requests should be open to anyone that logs in through Auth0)
     */

     if(req.originalUrl === `/api/user/${req.params.id}` && (req.method === 'PUT' || 'DELETE')){

         let paramId = Number(req.params.id);

         userDb.getById(paramId).then(user => {

             if(userId !== user[0].id){
                 return res.status(403).json({warning: `You do not have permission to do that.`})
             } else if(userId === user[0].id){
                 return next();
             }
         }).catch(err => {
             console.log(err);
             return res.status(500).json({error: `Internal server error.`})
         })
     }

     /**
      * Protect group members
      * ensures only members of a group can see group members
      */

      if(req.originalUrl === `/api/groupMember/group/${req.params.id} ` || req.originalUrl === `/api/groupMember/group/${req.params.id}/name`){
          let paramId = Number(req.params.id);

          groupMembersDb.getByGroup(paramId).then(members => {
              console.log("members: ", members);
              let member = members.filter(m => {
                  if(m.userID === userId){
                      console.log(m)
                      return m;
                  }
              })

              // console.log(member);
              if(member.length === 0 || !member){
                //   console.log("inside checkUser");
                  return res.status(403).json({warning: `You do not have permission to do that.`})
              } else {
                //   let nextFunction = await next();
                  next();
                  return res.status(200).json({message: `User confirmed`})
          }}).catch(err => {
              console.log(err);
              return res.status(500).json({error: `Internal server error.`})
          })
      }

      /**
       * @TODO Protect groupmember deletion route
       * Ensures only moderators and self-same members can delete a given user from the group
       */
      
  
       /**
        * Add Item to Group
        * Ensures member adding item is a member of the group
        */

        if(req.originalUrl === `/api/item` && req.method === 'POST'){
            let groupId = req.body.groupID;

            groupMembersDb.getByGroup(groupId).then(res => {
                let member = res.map(m => {
                    if(m.userID === userId){
                        return m;
                    }
                })

                if(member.length === 0){
                    return res.status(403).json({warning: `You do not have permission to do that.`})
                } else {
                    return next();
                }

            }).catch(err => {
                console.log(err);
                return res.status(500).json({error: `Internal server error.`})
            })
        }

}
    

module.exports = checkUser;