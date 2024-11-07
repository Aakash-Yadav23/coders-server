interface IEnvTyps{
    port:number;
    defaultPath:string;
};


export class EnvConfig{

    constructor(){

    };


    public envInit=():IEnvTyps=>{





        const port=parseInt(process.env.PORT!);







        const env:IEnvTyps={
            port,
            defaultPath:""
        }


        return  env


    }


}