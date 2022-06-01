const fs = require("fs");

const filename = process.argv[2];

const getData = () => {
  try {
    return JSON.parse(
      fs
        .readFileSync(filename, "utf8", (err, data) => {
          /*if (err) throw err
            var inputLines = data.toString().split("\n")
            // Add your code here to process input commands
            */
        })
        .toString()
    );
  } catch (e) {
    return {};
  }
};

//plan as per the problem **** 1 month is not define number of days so consider 28 days as standerd ***
const planDetails = {
  MUSIC: {
    PERSONAL: 100,
    PREMIUM: 250,
    FREE_MONTH: 28,
    PERSONAL_MONTH: 28,
    PREMIUM_MONTH: 84,
  },
  VIDEO: {
    PERSONAL: 200,
    PREMIUM: 500,
    FREE_MONTH: 28,
    PERSONAL_MONTH: 28,
    PREMIUM_MONTH: 84,
  },
  PODCAST: {
    PERSONAL: 100,
    PREMIUM: 300,
    FREE_MONTH: 28,
    PERSONAL_MONTH: 28,
    PREMIUM_MONTH: 84,
  },
  FOUR_DEVICE: {
    PER_MONTH: 50,
  },
  TEN_DEVICE: {
    PER_MONTH: 100,
  },
};
const fethSubscription = () => {
  const data = getData();
  if (data && data.PRINT_RENEWAL_DETAILS) {
    const todayDate = new Date();
    const tempDate = data.START_SUBSCRIPTION.split("-");
    const subDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0]);
    console.log(subDate);
    if (
      (+tempDate[0] <= 31 ||
        +tempDate[1] - 1 <= 11 ||
        +tempDate[2] <= todayDate.getFullYear()) &&
      subDate.getTime() <= todayDate.getTime()
    ) {
      //check for multiple add topups if present throw error message
      if (data.ADD_TOPUP.length <= 1) {
        let subData = [];
        let printData = [];
        let totalAmount = 0;
        let foundDup = false;
        for (const val of data.ADD_SUBSCRIPTION) {
          if (!subData.includes(val.type)) {
            subData.push(val.type);
            printData.push(getSubDetails(val.type, val.cat, subDate));
            totalAmount +=
              val.cat === "FREE" ? 0 : planDetails[val.type][val.cat];
          } else {
            foundDup = true;
            break;
          }
        }
        if (foundDup) {
          return "ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY";
        } else {
          data.ADD_TOPUP[0]
            ? (totalAmount +=
                planDetails[data.ADD_TOPUP[0].device_plan].PER_MONTH *
                data.ADD_TOPUP[0].months)
            : 0;
          printData.push(`RENEWAL_AMOUNT ${totalAmount}`);
          return printData;
        }
      } else {
        return "ADD_TOPUP_FAILED DUPLICATE_TOPUP";
      }
    } else {
      return "INVALID_DATE";
    }
  } else {
    return "SUBSCRIPTIONS_NOT_FOUND";
  }
};

const getSubDetails = (type, catType, subDate) => {
  let remDate = new Date(
    subDate.getFullYear(),
    subDate.getMonth(),
    subDate.getDate() + planDetails[type][`${catType}_MONTH`]
  );
  return `RENEWAL_REMINDER ${type} ${remDate.getDate()}-${
    remDate.getMonth() + 1
  }-${remDate.getFullYear()}`;
};

console.log(fethSubscription());
