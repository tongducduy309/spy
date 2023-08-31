import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from './services/crud.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{

  title = 'spy';
  id="";
  button={
    title:"SẴN SẰNG",
    color:"rgb(54, 162, 235)"
  };
  leader=false;
  inRoom:any=[];
  ip="";
  me:any={

  };
  went=0;
  roles:any=[];
  alert = "";
  unsub:any=[];

  constructor(private crud:CrudService, private http:HttpClient){}
  ngOnInit(): void {
    this.getIPAddress();


    this.getRoom();

  }

  getRoles(){
    this.unsub[1]=this.crud.getRoles().subscribe(roles=>{
      this.roles=roles;
    })
  }

  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ip = res.ip;
      //this.ip="42.123";

    });
  }

  getRoom(){
    this.unsub[0]=this.crud.getRoom().subscribe(room=>{
      let user=false;
      let n=-1;
      this.went=0;
      for (let r of room){
        if (r.id==this.ip) {
          user=true;
          this.me=r;
          //this.crud.updateData("room",this.ip,{status:false});
        }
        if (r.status&&!r.leader) this.went++;
      }
      console.log(user);
      if (!user){
        this.crud.addNewData("room",this.ip,{leader:false,status:false,role:""});
        this.getRoom();
      }
      let leader=false;
      for (let r of room){
        if (r.leader==true) {
          leader=true;
          break;
        }
      }
      //this.me.leader=false;
      if (room.length>0){
        if (!leader) {
          n=this.randomLeader(room);
          let i=0;
          this.crud.updateData("room",room[i].id,{leader:true});
          //room[n].leader=true;
        }

        if (this.me.leader) {
          this.leader=true;
          console.log("s",this.me.status);
          if (!this.me.status){
            this.button.title="BẮT ĐẦU";
            this.button.color="rgb(54, 162, 235)";

          }else{
            this.button.title="KẾT THÚC";
            this.button.color="rgb(255, 99, 132)";
          }

        }
        else {
          this.leader=false;
          if (!this.me.status){
            this.button.title="SẴN SÀNG";
            this.button.color="rgb(54, 162, 235)";

          }else{
            this.button.title="HỦY";
            this.button.color="rgb(255, 99, 132)";
          }
        }
      }
      if (this.me.leader)this.getRoles();
      this.inRoom=room;
      //console.log(this.button.title,);
    })

  }

  ngOnDestroy(): void {
    for (let sub of this.unsub)
      sub.unsubscribe();
    this.crud.deleteData("room",this.id);
  }

  getRandomInt(min:any, max:any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomLeader(users:any){
    let n=this.getRandomInt(0,users.length);

    return n;
  }

  ready(){
    if (this.me.leader){
      if (this.me.status){
        this.button.title="BẮT ĐẦU";
        this.button.color="rgb(54, 162, 235)";


        this.cancel();
        //this.crud.updateData("room",this.ip,{status:false});

      }else{
        this.button.title="KẾT THÚC";
        this.button.color="rgb(255, 99, 132)";


        this.startGame();
        this.crud.updateData("room",this.ip,{status:true});

      }

    }
    else{
      if (this.me.status){
        this.button.title="SẴN SÀNG";
        this.button.color="rgb(54, 162, 235)";
        this.crud.updateData("room",this.ip,{status:false});

      }else{

        this.button.title="HỦY";
        this.button.color="rgb(255, 99, 132)";
        this.crud.updateData("room",this.ip,{status:true});
      }



    }
    //this.me.status=!this.me.status;
  }

  cancel(){
    for (let r of this.inRoom){
      if (r.id!=this.ip)
      this.crud.deleteData("room",r.id);
    else this.crud.updateData("room",r.id,{status:false,role:""});
    }
    //this.crud.deleteAllData("room");
    // this.me.status=false;
    // this.me.role="";
    // this.crud.addNewData("room",this.id,{...this.me});
  }

  resetGame(){
    for (let r of this.inRoom){
      this.crud.updateData("room",r.id,{status:false,role:""});
    }
  }


  startGame(){
    let run=true;
    for (let r of this.inRoom){
      if (r.status==false){
        run=false;
        break;
      }
    }
    run=true;
    if (run){
      let nRole=this.getRandomInt(0,this.roles.length);
      let roles = this.roles[nRole];
      let n=this.getRandomInt(0,this.inRoom.length);
      let id= this.inRoom[n].id;
      for (let r of this.inRoom){
        if(r.id!=id)
        this.crud.updateData("room",r.id,{role:roles.role});
      else this.crud.updateData("room",r.id,{role:roles.spy+" (GIÁN ĐIỆP)"});
      }
    }
    else{
      this.createAlert("Có người chưa sẵn sàng");
    }




  }

  createAlert(mess:any){
    this.alert=mess;
    setTimeout(()=>{
      this.alert="";
    },3000)
  }


}
