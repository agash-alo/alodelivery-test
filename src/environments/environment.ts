const NODE_OPTIONS = "--max-old-space-size=4096"



// const UserPoolId = "me-south-1_3iRRfGvIh";
// export const environment = {
//   production: false,
//   avg_min_balance:'50',
//   login_end :'@nbbdev.com.bh',
//   //  base_url: 'http://localhost:3000/api/',
//   base_url:'',
//   // base_url: 'http://localhost:3000/api/',
//   // base_url:'https://d2b3er02aeu5q6.cloudfront.net/api/'
//    //base_url:'https://internal-awseb-awseb-1sp9aba48m1h5-305439469.me-south-1.elb.amazonaws.com/api/'
//    awsconfig: {
//     identityPoolId:"me-south-1:84ae1c84-90db-4212-ab7c-dd181a4e5862",
//     region: "me-south-1",
//     userPoolId: UserPoolId,
//     userPoolWebClientId: "2ng2rut7n2eg6a27k1u5076qcd",
//   }
// };

export const environment = {
  production: false,
  baseUrl: 'http://ec2-44-212-72-11.compute-1.amazonaws.com:8000/'

  // baseUrl:'http://ec2-54-166-234-61.compute-1.amazonaws.com:8000/'

  // baseUrl:'http://ec2-34-201-105-47.compute-1.amazonaws.com:8000/',
  // baseUrl: 'http://ec2-13-233-134-125.ap-south-1.compute.amazonaws.com:8000/',
  // baseUrl:"https://sealedtobusiness.com/api/",
  // devURl: ' ec2-13-232-231-11.ap-south-1.compute.amazonaws.com',
};
