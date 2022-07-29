const fs = require("fs");

const files = process.argv[2];

const getData = () => {
  try {
    return JSON.parse(
      fs
        .readFileSync(files, "utf8", (err, data) => {
        })
        .toString()
    );
  } catch (err) {
    return {};
  }
};




const plan = {
  MusicDetails: {
    Personal: 200,
    Premium: 300,
    Free_Month: 28,
    Personal_Month: 28,
    Premium_Month: 84,
  },


  VideoDetails: {
    Personal: 300,
    Premium: 600,
    Free_Month: 28,
    Personal_Month: 28,
    Premium_Month: 84,
  },


  PodcastDetails: {
    Personal: 200,
    Premium: 400,
    Free_Month: 28,
    Personal_Month: 28,
    Premium_Month: 84,
  },


  Four: {
    Per_Month: 40,
  },

  Ten: {
    Per_Month: 100,
  },

};


const Access = () => {
  const data = getData();


  if (data && data.PRINT_RENEWAL_DETAILS) {

    const today = new Date();
    const temp = data.START_SUBSCRIPTION.split("-");
    const subDate = new Date(+temp[2], +temp[1] - 1, +temp[0]);
    console.log(subDate);

    if (
      (+temp[0] <= 31 ||
        +temp[1] - 1 <= 11 ||
        +temp[2] <= today.getFullYear()) &&
      subDate.getTime() <= today.getTime()
    ) 
    {
      
      if (data.ADD_TOPUP.length <= 1) {

        let sub = [];
        let print = [];
        let total = 0;
        let Dup = false;


        for (const val of data.ADD_SUBSCRIPTION) {


          if (!sub.includes(val.type)) {
            sub.push(val.type);
            print.push(getSubDetails(val.type, val.cat, sub));
            total +=
              val.cat === "FREE" ? 0 : plan[val.type][val.cat];
          } 
          else {
            Dup = true;
            break;
          }

        }


        if (Dup) {
          return "SUBSCRIPTION  FAILED";
        } 
        
        else {
          data.ADD_TOPUP[0]
            ? (total +=
                plan[data.ADD_TOPUP[0].device_plan].PER_MONTH *
                data.ADD_TOPUP[0].months)
            : 0;

          print.push(`RENEWAL_AMOUNT ${total}`);
          return print;

        }


      } 

      else {
        return "ADD TOPUP FAILED";
      }
    } 

    else {
      return "INVALID DATE";
    }
  }

   else {
    return "NOT FOUND";
  }

};

const getSubDetails = (a, b, subDate) => {

  let remTime = new Date(
    subDate.getFullYear(),
    subDate.getMonth(),
    subDate.getDate() + plan[a][`${b}_MONTH`]
  );

  return `RENEWAL_REMINDER ${a} ${remTime.getDate()}-${
    remTime.getMonth() + 1
  }-${remTime.getFullYear()}`;

};


console.log(Access());
