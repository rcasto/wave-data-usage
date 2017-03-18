# wave-data-usage
CRON job to scrape data usage from Wave Broadband at the end of each day

## Getting Started

### You'll Need
* Wave Internet ([It's at least here in Seattle](http://residential.wavebroadband.com/order-now/))
* [Wave Internet Account Manager (IAM) account](https://secure.wavecable.com/iam/)
  * Make sure you have your login credentials handy
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)

### Up and Running
* Clone the repository onto your computer somewhere using:  
`git clone https://github.com/rcasto/wave-data-usage`
* `cd` to the cloned repository and run the following command at it's root:  
`npm install`  
This will install the necessary dependencies
* Adjust the config.json however you want, at the bare minimum adjust the **username** and **password** fields with your login credentials:  
```json
{
  "username": "<your-username>",
  "password": "<your-password>",
  "dataStore": "<where-you-want-to-store-data> | Defaults to data",
  "dataFilePrefix": "<prefix-you-want-prepended-to-data-files> | Defaults to usage-as-of",
  "cronTab": "<cron-tab-you-desire> | Defaults to 59 55 23 * * *"
}
```
**Note**: You can find more details on the cronTab format used at the [node-cron github page](https://github.com/merencia/node-cron) 
* Once you have the made the changes to config.json get running with the command:
`npm start`
* Now relax, you are now monitoring and saving your data usage
