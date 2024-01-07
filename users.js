const users=[]
const adduser=({id,name,room})=>{
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();
    const existingUser=users.find((user)=>user.room===room&&user.name===name);
    if(existingUser){
        console.log('existing user')
        return {error:'Username is taken '}
    }
    const user={id,name,room}
    users.push(user)
    console.log({user})
    return { user }


}
const removeUser=(id)=>{
const index=users.findIndex((user)=>user.id===id);
if(index!==-1){
    return users.splice(index,1)[0]
}

}
const getUser=(id)=>users.find((user)=>user.id===id)


const getUsersInRomm=(room)=>users.filter((user)=>user.room===room)
module.exports={adduser,removeUser,getUser,getUsersInRomm}