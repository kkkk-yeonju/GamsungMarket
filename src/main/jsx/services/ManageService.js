import * as axios from 'axios';

export const getUserList = () => {
    return new Promise( (resolve, reject) => {
        axios.get("list")
             .then( (result) =>{
                 console.log(result.data);

                 const data = result.data;
                 resolve(data);
                 return;
             })
             .catch((err) => {
                 console.log(err);

                 reject(err.message);
                 return;
             })
    })
}