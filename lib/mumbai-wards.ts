// Mumbai BMC Electoral Wards (Prabhags) — 227 wards
// Corporator data: corporators-3.json (2024/2026 cycle)
// MLA data: mumbai_suburban_mlas_2026.json (2026 cycle)
// admin_ward keys match BMC_WARD_INFO in Map.tsx

export type PrabhagInfo = {
  ward_no: number;
  candidate: string; // corporator / nagar sevak name
  party: string;
  admin_ward: string;
};

export type MlaInfo = {
  constituency: string;
  mla_name: string;
  party: string;
};

export type MicroArea = {
  ward_no: number;
  neighbourhoods: string[]; // specific localities inside that prabhag
};

// ── 2026 MLA Data ─────────────────────────────────────────────────────────────
export const MUMBAI_SUBURBAN_MLAS: MlaInfo[] = [
  { constituency: '152-Borivali',             mla_name: 'Sanjay Upadhay',               party: 'BJP' },
  { constituency: '153-Dahisar',              mla_name: 'Chaudhary Manisha Ashok',       party: 'BJP' },
  { constituency: '154-Magathane',            mla_name: 'Prakash Rajaram Surve',         party: 'Shiv Sena' },
  { constituency: '155-Mulund',               mla_name: 'Kotecha Mihir Chadrakant',      party: 'BJP' },
  { constituency: '156-Vikhroli',             mla_name: 'Raut Sunil Rajaram',            party: 'Shiv Sena UBT' },
  { constituency: '157-Bhandup West',         mla_name: 'Ashok Patil',                   party: 'Shiv Sena' },
  { constituency: '158-Jogeshwari East',      mla_name: 'Anant Nar',                     party: 'Shiv Sena UBT' },
  { constituency: '159-Dindoshi',             mla_name: 'Sunil Prabhu',                  party: 'Shiv Sena UBT' },
  { constituency: '160-Kandivali East',       mla_name: 'Atul Bhatkhalkar',              party: 'BJP' },
  { constituency: '161-Charkop',              mla_name: 'Yogesh Sagar',                  party: 'BJP' },
  { constituency: '162-Malad West',           mla_name: 'Aslam Ramzanali Shaikh',        party: 'Congress' },
  { constituency: '163-Goregaon',             mla_name: 'Vidya Jaiprakash Thakur',       party: 'BJP' },
  { constituency: '164-Varsova',              mla_name: 'Harun Khan',                    party: 'Shiv Sena UBT' },
  { constituency: '165-Andheri West',         mla_name: 'Ameet Bhaskar Satam',           party: 'BJP' },
  { constituency: '166-Andheri East',         mla_name: 'Muraji Patel',                  party: 'Shiv Sena' },
  { constituency: '167-Vile Parle',           mla_name: 'Alavani Parag',                 party: 'BJP' },
  { constituency: '168-Chandivali',           mla_name: 'Dilip Bhausaheb Lande',         party: 'Shiv Sena' },
  { constituency: '169-Ghatkopar West',       mla_name: 'Ram Kadam',                     party: 'BJP' },
  { constituency: '170-Ghatkopar East',       mla_name: 'Parag Shah',                    party: 'BJP' },
  { constituency: '171-Mankhurd Shivaji Nagar', mla_name: 'Abu Asim Azmi',              party: 'Samajwadi Party' },
  { constituency: '172-Anushakti Nagar',      mla_name: 'Sana Malik',                    party: 'NCP (Ajit)' },
  { constituency: '173-Chembur',              mla_name: 'Tukaram Kate',                  party: 'Shiv Sena' },
  { constituency: '174-Kurla (SC)',           mla_name: 'Mangesh Kudalkar',              party: 'Shiv Sena' },
  { constituency: '175-Kalina',               mla_name: 'Sanjay Govind Potnis',          party: 'Shiv Sena UBT' },
  { constituency: '176-Vandre East',          mla_name: 'Varun Sardesai',                party: 'Shiv Sena UBT' },
  { constituency: '177-Vandre West',          mla_name: 'Adv. Ashish Babaji Shelar',     party: 'BJP' },
];

// ── 2024/2026 Corporator / Nagar Sevak Data ───────────────────────────────────
export const MUMBAI_PRABHAGS: PrabhagInfo[] = [
  { ward_no: 1,   candidate: 'Rekha Yadav',                          party: 'Shiv Sena',      admin_ward: 'A'   },
  { ward_no: 2,   candidate: 'Tejashwi Ghosalkar',                   party: 'Shiv Sena',      admin_ward: 'A'   },
  { ward_no: 3,   candidate: 'Prakash Darekar',                       party: 'BJP',            admin_ward: 'A'   },
  { ward_no: 4,   candidate: 'Mangesh Pangare',                       party: 'Shiv Sena',      admin_ward: 'B'   },
  { ward_no: 5,   candidate: 'Sanjay Ghadi',                          party: 'Shiv Sena',      admin_ward: 'B'   },
  { ward_no: 6,   candidate: 'Diksha Harshad Karkar',                 party: 'Shiv Sena',      admin_ward: 'B'   },
  { ward_no: 7,   candidate: 'Ganesh Khankar',                        party: 'BJP',            admin_ward: 'B'   },
  { ward_no: 8,   candidate: 'Yogita Patil',                          party: 'BJP',            admin_ward: 'C'   },
  { ward_no: 9,   candidate: 'Shivanand Shetty',                      party: 'BJP',            admin_ward: 'C'   },
  { ward_no: 10,  candidate: 'Jitendra Patel',                        party: 'BJP',            admin_ward: 'C'   },
  { ward_no: 11,  candidate: 'Aditi Khursange',                       party: 'Shiv Sena',      admin_ward: 'C'   },
  { ward_no: 12,  candidate: 'Sarika Jhore',                          party: 'Shiv Sena UBT',  admin_ward: 'D'   },
  { ward_no: 13,  candidate: 'Rani Dwivedi',                          party: 'BJP',            admin_ward: 'D'   },
  { ward_no: 14,  candidate: 'Seema Kiran Shinde',                    party: 'BJP',            admin_ward: 'D'   },
  { ward_no: 15,  candidate: 'Jignasa Shaha',                         party: 'BJP',            admin_ward: 'D'   },
  { ward_no: 16,  candidate: 'Shweta Korgawkar',                      party: 'BJP',            admin_ward: 'E'   },
  { ward_no: 17,  candidate: 'Shilpa Saurabh Sangore',                party: 'BJP',            admin_ward: 'E'   },
  { ward_no: 18,  candidate: 'Sandhya Vipul Doshi',                   party: 'Shiv Sena',      admin_ward: 'E'   },
  { ward_no: 19,  candidate: 'Shrikant Kavathankar',                  party: 'BJP',            admin_ward: 'E'   },
  { ward_no: 20,  candidate: 'Deepak Tawde',                          party: 'BJP',            admin_ward: 'F/N' },
  { ward_no: 21,  candidate: 'Lina Patel Deherkar',                   party: 'BJP',            admin_ward: 'F/N' },
  { ward_no: 22,  candidate: 'Himanshu Parekh',                       party: 'BJP',            admin_ward: 'F/N' },
  { ward_no: 23,  candidate: 'Shivakumar Jha',                        party: 'BJP',            admin_ward: 'F/N' },
  { ward_no: 24,  candidate: 'Swati Jaiswal',                         party: 'BJP',            admin_ward: 'F/N' },
  { ward_no: 25,  candidate: 'Nisha Parulekar',                       party: 'BJP',            admin_ward: 'F/S' },
  { ward_no: 26,  candidate: 'Dharmendra Kale',                       party: 'Shiv Sena UBT',  admin_ward: 'F/S' },
  { ward_no: 27,  candidate: 'Neelam Sunil Gurav',                    party: 'BJP',            admin_ward: 'F/S' },
  { ward_no: 28,  candidate: 'Ajanta Yadav',                          party: 'Congress',       admin_ward: 'F/S' },
  { ward_no: 29,  candidate: 'Sachin Patil',                          party: 'Shiv Sena UBT',  admin_ward: 'G/N' },
  { ward_no: 30,  candidate: 'Dhaval Vora',                           party: 'BJP',            admin_ward: 'G/N' },
  { ward_no: 31,  candidate: 'Manisha Kamlesh Yadav',                 party: 'BJP',            admin_ward: 'G/N' },
  { ward_no: 32,  candidate: 'Geeta Bhandari',                        party: 'Shiv Sena UBT',  admin_ward: 'G/N' },
  { ward_no: 33,  candidate: 'Qamar Jahan Moeen Siddiqui',            party: 'Congress',       admin_ward: 'G/S' },
  { ward_no: 34,  candidate: 'Haiderali Aslam Sheikh',                party: 'Congress',       admin_ward: 'G/S' },
  { ward_no: 35,  candidate: 'Yogesh Rajbadur Verma',                 party: 'BJP',            admin_ward: 'G/S' },
  { ward_no: 36,  candidate: 'Siddharth Sharma',                      party: 'BJP',            admin_ward: 'H/E' },
  { ward_no: 37,  candidate: 'Yogita Kadam',                          party: 'Shiv Sena UBT',  admin_ward: 'H/E' },
  { ward_no: 38,  candidate: 'Surekha Parab',                         party: 'MNS',            admin_ward: 'H/E' },
  { ward_no: 39,  candidate: 'Pushpa Kalmbe',                         party: 'Shiv Sena UBT',  admin_ward: 'H/E' },
  { ward_no: 40,  candidate: 'Tulashiram Shinde',                     party: 'Shiv Sena UBT',  admin_ward: 'H/E' },
  { ward_no: 41,  candidate: 'Suhas Wadkar',                          party: 'Shiv Sena UBT',  admin_ward: 'H/W' },
  { ward_no: 42,  candidate: 'Dhanashree Vaibhav Bharadkar',          party: 'Shiv Sena',      admin_ward: 'H/W' },
  { ward_no: 43,  candidate: 'Ajit Balkrishna Ravarane',              party: 'NCP (SP)',       admin_ward: 'H/W' },
  { ward_no: 44,  candidate: 'Sangeeta Sharma',                       party: 'BJP',            admin_ward: 'H/W' },
  { ward_no: 45,  candidate: 'Sanjay Namdev Kamble',                  party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 46,  candidate: 'Yogita Koli',                           party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 47,  candidate: 'Tejindersing Tiwana',                   party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 48,  candidate: 'Rafiq Ilyas Sheikh',                    party: 'Congress',       admin_ward: 'K/E' },
  { ward_no: 49,  candidate: 'Sangita Koli',                          party: 'Congress',       admin_ward: 'K/E' },
  { ward_no: 50,  candidate: 'Vikram Rajput',                         party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 51,  candidate: 'Varsha Swapnil Tembalkar',              party: 'Shiv Sena',      admin_ward: 'K/W' },
  { ward_no: 52,  candidate: 'Preeti Satam',                          party: 'BJP',            admin_ward: 'K/W' },
  { ward_no: 53,  candidate: 'Jitendra Valvi',                        party: 'Shiv Sena UBT',  admin_ward: 'K/W' },
  { ward_no: 54,  candidate: 'Ankit Sunil Prabhu',                    party: 'Shiv Sena UBT',  admin_ward: 'K/W' },
  { ward_no: 55,  candidate: 'Harsh Patel',                           party: 'BJP',            admin_ward: 'K/W' },
  { ward_no: 56,  candidate: 'Laxmi Bhatia',                          party: 'Shiv Sena UBT',  admin_ward: 'K/W' },
  { ward_no: 57,  candidate: 'Pillay Srikala Ramachandran',           party: 'BJP',            admin_ward: 'L'   },
  { ward_no: 58,  candidate: 'Sandeep Patel',                         party: 'BJP',            admin_ward: 'L'   },
  { ward_no: 59,  candidate: 'Yashodhar Fanse',                       party: 'Shiv Sena UBT',  admin_ward: 'L'   },
  { ward_no: 60,  candidate: 'Sayley Kulkarni',                       party: 'BJP',            admin_ward: 'L'   },
  { ward_no: 61,  candidate: 'Divya Avnish Singh',                    party: 'Congress',       admin_ward: 'L'   },
  { ward_no: 62,  candidate: 'Jhishan Genghis Multani',               party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 63,  candidate: 'Rupesh Savarkar',                       party: 'BJP',            admin_ward: 'M/E' },
  { ward_no: 64,  candidate: 'Saba Harun Khan',                       party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 65,  candidate: 'Vitthal Banderi',                       party: 'BJP',            admin_ward: 'M/E' },
  { ward_no: 66,  candidate: 'Haider Mehr Mohsin',                    party: 'Congress',       admin_ward: 'M/E' },
  { ward_no: 67,  candidate: 'Deepak Kotekar',                        party: 'BJP',            admin_ward: 'M/W' },
  { ward_no: 68,  candidate: 'Rohan Rathore',                         party: 'BJP',            admin_ward: 'M/W' },
  { ward_no: 69,  candidate: 'Sudha Shambhunath Singh',               party: 'BJP',            admin_ward: 'M/W' },
  { ward_no: 70,  candidate: 'Anish Makwani',                         party: 'BJP',            admin_ward: 'M/W' },
  { ward_no: 71,  candidate: 'Sunita Rajesh Mehta',                   party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 72,  candidate: 'Mamata Yadav',                          party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 73,  candidate: 'Lona Rawat',                            party: 'Shiv Sena UBT',  admin_ward: 'N'   },
  { ward_no: 74,  candidate: 'Vidya Arya',                            party: 'MNS',            admin_ward: 'N'   },
  { ward_no: 75,  candidate: 'Pramod Pandurang Sawant',               party: 'Shiv Sena UBT',  admin_ward: 'N'   },
  { ward_no: 76,  candidate: 'Prakash Daulat Musale',                 party: 'BJP',            admin_ward: 'P/N' },
  { ward_no: 77,  candidate: 'Shivani Shailesh Parab',                party: 'Shiv Sena UBT',  admin_ward: 'P/N' },
  { ward_no: 78,  candidate: 'Sophie Nazia Abdul Jabbar',             party: 'Shiv Sena',      admin_ward: 'P/N' },
  { ward_no: 79,  candidate: 'Juatkar Mansi Madhukar',                party: 'Shiv Sena UBT',  admin_ward: 'P/N' },
  { ward_no: 80,  candidate: 'Disha Sunil Yadav',                     party: 'BJP',            admin_ward: 'P/N' },
  { ward_no: 81,  candidate: 'Kesharben Murji Patel',                 party: 'BJP',            admin_ward: 'P/N' },
  { ward_no: 82,  candidate: 'Amin Jagdishwari Jagadish',             party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 84,  candidate: 'Anjali Samant',                         party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 85,  candidate: 'Milind Ramnath Shinde',                 party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 86,  candidate: 'Rai Ritesh Kamlesh',                    party: 'Shiv Sena',      admin_ward: 'P/S' },
  { ward_no: 87,  candidate: 'Pooja Mahadeshwar',                     party: 'Shiv Sena UBT',  admin_ward: 'R/C' },
  { ward_no: 88,  candidate: 'Sharvari Parab',                        party: 'Shiv Sena UBT',  admin_ward: 'R/C' },
  { ward_no: 89,  candidate: 'Geetesh Raut',                          party: 'Shiv Sena UBT',  admin_ward: 'R/C' },
  { ward_no: 90,  candidate: 'Tulip Miranda',                         party: 'Congress',       admin_ward: 'R/N' },
  { ward_no: 91,  candidate: 'Sagun Vasant Naik',                     party: 'Shiv Sena',      admin_ward: 'R/N' },
  { ward_no: 92,  candidate: 'Mohd. Ibrahim Qureshi',                 party: 'Congress',       admin_ward: 'R/N' },
  { ward_no: 93,  candidate: 'Rohini Kamle',                          party: 'Shiv Sena UBT',  admin_ward: 'R/N' },
  { ward_no: 94,  candidate: 'Padma Dipak Bhutkar',                   party: 'Shiv Sena UBT',  admin_ward: 'R/S' },
  { ward_no: 95,  candidate: 'Hari Jagannath Shastri',                party: 'Shiv Sena UBT',  admin_ward: 'R/S' },
  { ward_no: 96,  candidate: 'Khan Ayesha Shams',                     party: 'NCP',            admin_ward: 'R/S' },
  { ward_no: 97,  candidate: 'Hetal Gala',                            party: 'BJP',            admin_ward: 'R/S' },
  { ward_no: 98,  candidate: 'Alka Subhash Kerkar',                   party: 'BJP',            admin_ward: 'S'   },
  { ward_no: 99,  candidate: 'Chintamani Dattaram Niwate',            party: 'Shiv Sena UBT',  admin_ward: 'S'   },
  { ward_no: 100, candidate: 'Swapna Mhatre',                         party: 'BJP',            admin_ward: 'S'   },
  { ward_no: 101, candidate: 'Aaron Sicilia Demelo',                  party: 'Congress',       admin_ward: 'S'   },
  { ward_no: 102, candidate: 'Khan Rahebar Siraj',                    party: 'Congress',       admin_ward: 'S'   },
  { ward_no: 103, candidate: 'Hetal Gala Morvekar',                   party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 104, candidate: 'Prakash Gangadhare',                    party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 105, candidate: 'Anita Nandkumar Vaiti',                 party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 106, candidate: 'Prabhakar Shinde',                      party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 107, candidate: 'Neil Kirit Somaiya',                    party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 108, candidate: 'Dipika Message Ghag',                   party: 'BJP',            admin_ward: 'T'   },
  { ward_no: 109, candidate: 'Suresh Atmaram Shinde',                 party: 'Shiv Sena UBT',  admin_ward: 'S'   },
  { ward_no: 110, candidate: 'Asha Suresh Koparkar',                  party: 'Congress',       admin_ward: 'S'   },
  { ward_no: 111, candidate: 'Deepak Sawant',                         party: 'Shiv Sena UBT',  admin_ward: 'S'   },
  { ward_no: 112, candidate: 'Witness Darvi',                         party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 113, candidate: 'Dipmala Baban Grow',                    party: 'Shiv Sena UBT',  admin_ward: 'N'   },
  { ward_no: 114, candidate: 'Rajul Sanjay Patil',                    party: 'Shiv Sena UBT',  admin_ward: 'N'   },
  { ward_no: 115, candidate: 'Rajbhoj Jyoti Anil',                    party: 'MNS',            admin_ward: 'N'   },
  { ward_no: 116, candidate: 'Jagriti Prakti Patil',                  party: 'BJP',            admin_ward: 'P/N' },
  { ward_no: 117, candidate: 'Shweta Pavaskar',                       party: 'Shiv Sena UBT',  admin_ward: 'P/N' },
  { ward_no: 118, candidate: 'Sunita Chandrashekhar Jadhav',          party: 'Shiv Sena UBT',  admin_ward: 'P/N' },
  { ward_no: 119, candidate: 'Rajesh Pandhrinath Sonawale',           party: 'Shiv Sena',      admin_ward: 'P/N' },
  { ward_no: 120, candidate: 'Vishwas Tukaram Shinde',                party: 'Shiv Sena UBT',  admin_ward: 'P/S' },
  { ward_no: 121, candidate: 'Priyadarshini Thackeray',               party: 'Shiv Sena UBT',  admin_ward: 'P/S' },
  { ward_no: 122, candidate: 'Chandan Sharma',                        party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 123, candidate: 'Sunil More',                            party: 'Shiv Sena UBT',  admin_ward: 'P/S' },
  { ward_no: 124, candidate: 'Sakina Sheikh',                         party: 'Shiv Sena UBT',  admin_ward: 'R/C' },
  { ward_no: 125, candidate: 'Suresh Avale',                          party: 'Shiv Sena',      admin_ward: 'R/C' },
  { ward_no: 126, candidate: 'Archana Bhalerao',                      party: 'BJP',            admin_ward: 'R/C' },
  { ward_no: 127, candidate: 'Swarupa Tukaram Patil',                 party: 'Shiv Sena UBT',  admin_ward: 'R/N' },
  { ward_no: 128, candidate: 'Sai Shirke',                            party: 'MNS',            admin_ward: 'R/N' },
  { ward_no: 129, candidate: 'Ashwini Bharat Mate',                   party: 'BJP',            admin_ward: 'R/N' },
  { ward_no: 130, candidate: 'Dharmesh Bhupat Giri',                  party: 'BJP',            admin_ward: 'R/S' },
  { ward_no: 131, candidate: 'Rakhi Harishchandra Jadhav',            party: 'BJP',            admin_ward: 'R/S' },
  { ward_no: 132, candidate: 'Ritu Rajesh Tawde',                     party: 'BJP',            admin_ward: 'R/S' },
  { ward_no: 133, candidate: 'Bibhishan Kande',                       party: 'Shiv Sena',      admin_ward: 'K/E' },
  { ward_no: 134, candidate: 'Mehjabeen Atique Ahmed Khan',           party: 'AIMIM',          admin_ward: 'B'   },
  { ward_no: 135, candidate: 'Navnath Ban',                           party: 'BJP',            admin_ward: 'B'   },
  { ward_no: 136, candidate: 'Zameer Murtuza Qureshi',                party: 'AIMIM',          admin_ward: 'B'   },
  { ward_no: 137, candidate: 'Sameer Patel',                          party: 'AIMIM',          admin_ward: 'C'   },
  { ward_no: 138, candidate: 'Roshan Irfan Sheikh',                   party: 'AIMIM',          admin_ward: 'C'   },
  { ward_no: 139, candidate: 'Shabana Atif Sheikh',                   party: 'AIMIM',          admin_ward: 'E'   },
  { ward_no: 140, candidate: 'Vijay Tatoba Ubale',                    party: 'AIMIM',          admin_ward: 'E'   },
  { ward_no: 141, candidate: 'Vitthal Govind Lokre',                  party: 'Shiv Sena UBT',  admin_ward: 'F/N' },
  { ward_no: 142, candidate: 'Aayant Khandekar',                      party: 'Shiv Sena',      admin_ward: 'F/N' },
  { ward_no: 143, candidate: 'Shabana Mohammad Farooq Qazi',          party: 'AIMIM',          admin_ward: 'F/S' },
  { ward_no: 144, candidate: 'Dinesh Panchal',                        party: 'BJP',            admin_ward: 'G/N' },
  { ward_no: 145, candidate: 'Khairunnisa Akbar Hussain',             party: 'AIMIM',          admin_ward: 'G/S' },
  { ward_no: 146, candidate: 'Samriddhi Ganesh Kate',                 party: 'Shiv Sena',      admin_ward: 'H/E' },
  { ward_no: 147, candidate: 'Pragya Sadaphule',                      party: 'Shiv Sena',      admin_ward: 'H/E' },
  { ward_no: 148, candidate: 'Anjali Sanjay Naik',                    party: 'Shiv Sena',      admin_ward: 'H/W' },
  { ward_no: 149, candidate: 'Sushma Sawant',                         party: 'BJP',            admin_ward: 'H/W' },
  { ward_no: 150, candidate: 'Vaishali Ajit Shendkar',                party: 'Congress',       admin_ward: 'K/E' },
  { ward_no: 151, candidate: 'Kashish Phulwaria',                     party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 152, candidate: 'Asha Subhash Marathe',                  party: 'BJP',            admin_ward: 'K/W' },
  { ward_no: 153, candidate: 'Minakshi Patankar',                     party: 'Shiv Sena UBT',  admin_ward: 'K/W' },
  { ward_no: 154, candidate: 'Mahadev Shivana',                       party: 'BJP',            admin_ward: 'L'   },
  { ward_no: 155, candidate: 'Snehal Vishnu Shivkar',                 party: 'Shiv Sena UBT',  admin_ward: 'L'   },
  { ward_no: 156, candidate: 'Ashwini Matekar',                       party: 'Shiv Sena',      admin_ward: 'L'   },
  { ward_no: 157, candidate: 'Sarita Mhaske',                         party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 158, candidate: 'Chitra Somnath Sangle',                 party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 159, candidate: 'Prakash Devji More',                    party: 'BJP',            admin_ward: 'M/W' },
  { ward_no: 160, candidate: 'Kiran Landge',                          party: 'Shiv Sena',      admin_ward: 'M/W' },
  { ward_no: 161, candidate: 'Vijayendra Onkar Shinde',               party: 'Shiv Sena',      admin_ward: 'M/W' },
  { ward_no: 162, candidate: 'Amir Naseem Khan',                      party: 'Congress',       admin_ward: 'M/W' },
  { ward_no: 163, candidate: 'Shaila Dilip Lande',                    party: 'Shiv Sena',      admin_ward: 'N'   },
  { ward_no: 164, candidate: 'Harish Bhandirge',                      party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 165, candidate: 'Ashraf Azhmi',                          party: 'Congress',       admin_ward: 'M/E' },
  { ward_no: 166, candidate: 'Meenal Sanjay Turde',                   party: 'Shiv Sena',      admin_ward: 'M/E' },
  { ward_no: 167, candidate: 'Dr Saman Arshad Azhmi',                 party: 'Congress',       admin_ward: 'M/E' },
  { ward_no: 168, candidate: 'Dr Saeeda Khan',                        party: 'NCP',            admin_ward: 'M/W' },
  { ward_no: 169, candidate: 'Pravina Manish Morajkar',               party: 'Shiv Sena UBT',  admin_ward: 'F/S' },
  { ward_no: 170, candidate: 'Bushra Nadeem Captain Malik',           party: 'NCP',            admin_ward: 'F/S' },
  { ward_no: 171, candidate: 'Rani Yerunkar',                         party: 'Shiv Sena UBT',  admin_ward: 'G/N' },
  { ward_no: 172, candidate: 'Rajeshri Rajesh Shirwadkar',            party: 'BJP',            admin_ward: 'G/S' },
  { ward_no: 173, candidate: 'Shilpa Duttaram Keluskar',              party: 'BJP',            admin_ward: 'G/S' },
  { ward_no: 174, candidate: 'Kanojia Sakshi Anil',                   party: 'BJP',            admin_ward: 'H/E' },
  { ward_no: 175, candidate: 'Mansi Satamkar',                        party: 'Shiv Sena',      admin_ward: 'H/E' },
  { ward_no: 176, candidate: 'Line R. K. Yadav',                      party: 'BJP',            admin_ward: 'H/W' },
  { ward_no: 177, candidate: 'Kalpesha Jesal Kothari',                party: 'BJP',            admin_ward: 'H/W' },
  { ward_no: 178, candidate: 'Amey Arun Ghole',                       party: 'Shiv Sena',      admin_ward: 'K/E' },
  { ward_no: 179, candidate: 'Ayesha Sufiyan Vanu',                   party: 'NCP',            admin_ward: 'K/E' },
  { ward_no: 180, candidate: 'Trishna Biswasrao',                     party: 'Shiv Sena',      admin_ward: 'K/W' },
  { ward_no: 181, candidate: 'Anilbhau Kadam',                        party: 'Shiv Sena UBT',  admin_ward: 'L'   },
  { ward_no: 182, candidate: 'Milind Vaidya',                         party: 'Shiv Sena UBT',  admin_ward: 'L'   },
  { ward_no: 183, candidate: 'Asha Deepak Kale',                      party: 'Congress',       admin_ward: 'M/W' },
  { ward_no: 184, candidate: 'Sajida Bi Haji Babbu Khan',             party: 'Congress',       admin_ward: 'M/W' },
  { ward_no: 185, candidate: 'Jagdish Thewalpeel',                    party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 186, candidate: 'Archana Avirat Shinde',                 party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 187, candidate: 'Joseph Manvel Koli',                    party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 188, candidate: 'Bhaskar Shetty',                        party: 'Shiv Sena',      admin_ward: 'N'   },
  { ward_no: 189, candidate: 'Harshala Ashish More',                  party: 'Shiv Sena UBT',  admin_ward: 'N'   },
  { ward_no: 190, candidate: 'Shital Suresh Gambhir',                 party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 191, candidate: 'Vishakha Raut',                         party: 'Shiv Sena UBT',  admin_ward: 'P/S' },
  { ward_no: 192, candidate: 'Yashwant Killedar',                     party: 'MNS',            admin_ward: 'R/C' },
  { ward_no: 193, candidate: 'Hemangi Hareswar Varlikar',             party: 'Shiv Sena UBT',  admin_ward: 'R/N' },
  { ward_no: 194, candidate: 'Nishikant Shinde',                      party: 'Shiv Sena UBT',  admin_ward: 'R/N' },
  { ward_no: 195, candidate: 'Vijay Jagannath Bhange',                party: 'Shiv Sena UBT',  admin_ward: 'R/S' },
  { ward_no: 196, candidate: 'Padmaja Chemburkar',                    party: 'Shiv Sena UBT',  admin_ward: 'M/W' },
  { ward_no: 197, candidate: 'Vanita Dattaram Naravankar',            party: 'Shiv Sena',      admin_ward: 'M/W' },
  { ward_no: 198, candidate: 'Aboli Gopal Khade',                     party: 'Shiv Sena UBT',  admin_ward: 'M/E' },
  { ward_no: 199, candidate: 'Kishori Kishore Pednekar',              party: 'Shiv Sena UBT',  admin_ward: 'G/N' },
  { ward_no: 200, candidate: 'Urmila Panchaal',                       party: 'Shiv Sena UBT',  admin_ward: 'G/N' },
  { ward_no: 201, candidate: 'Iram Sajit Ahmad Siddiqui',             party: 'Samajwadi Party', admin_ward: 'E'  },
  { ward_no: 202, candidate: 'Shraddha Jadhav',                       party: 'Shiv Sena UBT',  admin_ward: 'F/N' },
  { ward_no: 203, candidate: 'Shraddha Pednekar',                     party: 'Shiv Sena UBT',  admin_ward: 'F/S' },
  { ward_no: 204, candidate: 'Kiran Prabhakar Tawde',                 party: 'Shiv Sena UBT',  admin_ward: 'G/S' },
  { ward_no: 205, candidate: 'Supriya Dilip Dalvi',                   party: 'MNS',            admin_ward: 'H/E' },
  { ward_no: 206, candidate: 'Sachin Padval',                         party: 'Shiv Sena UBT',  admin_ward: 'H/W' },
  { ward_no: 207, candidate: 'Rohidas Lokhande',                      party: 'BJP',            admin_ward: 'K/E' },
  { ward_no: 208, candidate: 'Ramakant Sakharam Rahte',               party: 'Shiv Sena UBT',  admin_ward: 'K/W' },
  { ward_no: 209, candidate: 'Yamini Jadhav',                         party: 'Shiv Sena',      admin_ward: 'L'   },
  { ward_no: 210, candidate: 'Sonam Jamsutkar',                       party: 'Shiv Sena UBT',  admin_ward: 'L'   },
  { ward_no: 211, candidate: 'Waqar Khan',                            party: 'Congress',       admin_ward: 'M/E' },
  { ward_no: 212, candidate: 'Abrahani Shahzad',                      party: 'Samajwadi Party', admin_ward: 'M/E' },
  { ward_no: 213, candidate: 'Naseema Javed Juneja',                  party: 'Congress',       admin_ward: 'M/W' },
  { ward_no: 214, candidate: 'Ajay Patil',                            party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 215, candidate: 'Santosh Male',                          party: 'BJP',            admin_ward: 'N'   },
  { ward_no: 216, candidate: 'Rajeshri Mahesh Bhatankar',             party: 'Congress',       admin_ward: 'P/N' },
  { ward_no: 217, candidate: 'Gaurang Zaveri',                        party: 'BJP',            admin_ward: 'P/S' },
  { ward_no: 218, candidate: 'Snehal Tendulkar',                      party: 'BJP',            admin_ward: 'R/C' },
  { ward_no: 219, candidate: 'Sunny Sanap',                           party: 'BJP',            admin_ward: 'R/N' },
  { ward_no: 220, candidate: 'Sampada Vaibhav Mayekar',               party: 'Shiv Sena UBT',  admin_ward: 'R/S' },
  { ward_no: 221, candidate: 'Akash Raj Purohit',                     party: 'BJP',            admin_ward: 'S'   },
  { ward_no: 222, candidate: 'Rita Bharat Makwana',                   party: 'BJP',            admin_ward: 'S'   },
  { ward_no: 223, candidate: 'Gyanraj Yashwant Nikam',                party: 'Congress',       admin_ward: 'S'   },
  { ward_no: 224, candidate: 'Parack Ruksana Nurul Amin',             party: 'Congress',       admin_ward: 'T'   },
  { ward_no: 225, candidate: 'Harshita Ashwin Narwekar',              party: 'BJP',            admin_ward: 'A'   },
  { ward_no: 226, candidate: 'Makarand Suresh Narwekar',              party: 'BJP',            admin_ward: 'A'   },
  { ward_no: 227, candidate: 'Gauravi Shivalkar Narwekar',            party: 'BJP',            admin_ward: 'A'   },
];

// ── Micro-area / neighbourhood tiles per Prabhag (ward_no) ───────────────────
// These are the actual localities, colonies, nagar, chawls that fall inside each
// prabhag. Used to render "micro tiles" in the bottom sheet.
export const PRABHAG_MICRO_AREAS: Record<number, string[]> = {
  // Ward A — Colaba / Churchgate
  1:  ['Colaba Causeway', 'Navy Nagar', 'Afghan Memorial Church area'],
  2:  ['Cuffe Parade', 'World Trade Centre', 'Backbay Reclamation'],
  3:  ['Churchgate', 'Nariman Point', 'Fort', 'Mantralaya'],
  // Ward B — Dongri / Mazagaon
  4:  ['Mazagaon', 'Dockyard Road', 'P. D\'Mello Road'],
  5:  ['Dongri', 'Musafirkhana', 'Mohd. Ali Road'],
  6:  ['Nagpada', 'Byculla (part)', 'J. J. Hospital area'],
  7:  ['Masjid Bunder', 'Carnac Bunder', 'Mandvi'],
  // Ward C — Pydhonie / Bhuleshwar
  8:  ['Pydhonie', 'Bhuleshwar', 'Kalbadevi'],
  9:  ['Crawford Market', 'Lohar Chawl', 'Princess Street'],
  10: ['Mandvi', 'Null Bazaar', 'Bhendi Bazaar'],
  11: ['Carnac Bridge', 'Sandhurst Road', 'Maulana Shaukat Ali Road'],
  // Ward D — Girgaon / Malabar Hill
  12: ['Girgaon', 'Chowpatty', 'Teen Batti'],
  13: ['Malabar Hill', 'Ridge Road', 'B. G. Kher Marg'],
  14: ['Grant Road (W)', 'Tardeo', 'Bhulabhai Desai Road'],
  15: ['Breach Candy', 'Kemps Corner', 'Peddar Road'],
  // Ward E — Byculla / Sewri
  16: ['Byculla (E)', 'Agripada', 'Naigaon'],
  17: ['Sewri', 'Cotton Green', 'Reay Road'],
  18: ['NM Joshi Marg', 'Lower Parel (part)', 'Chinchpokli'],
  19: ['Antop Hill (part)', 'Dockyard', 'Ferry Wharf'],
  // Ward F/N — Matunga / Sion
  20: ['Matunga (E)', 'Dharavi (N)', 'Sion (part)'],
  21: ['Sion', 'Chunabhatti (part)', 'Antop Hill'],
  22: ['Wadala (E)', 'GTB Nagar', 'Anik'],
  23: ['Dharavi', 'Kala Killa', 'Transit Camp'],
  24: ['Matunga (W)', 'King\'s Circle', 'Hindmata'],
  // Ward F/S — Parel / Lower Parel
  25: ['Parel', 'Tulsiwadi', 'Ganesh Nagar'],
  26: ['Lalbaug', 'Curry Road', 'Kalachowki'],
  27: ['Lower Parel', 'Kamla Mills', 'Senapati Bapat Marg'],
  28: ['Naigaon (S)', 'Worli Koliwada (part)', 'Elphinstone Rd'],
  // Ward G/N — Dadar / Shivaji Park
  29: ['Dadar TT', 'Dadar Chowk', 'Hindu Colony'],
  30: ['Shivaji Park', 'Chaityabhoomi', 'Cadell Road'],
  31: ['Mahim', 'Bandra Terminus area', 'Dharavi (W)'],
  32: ['Dharavi (S)', 'Sion Koliwada (part)', 'Rajiv Gandhi Nagar'],
  // Ward G/S — Worli / Prabhadevi
  33: ['Worli', 'Worli Sea Face', 'Atria Mall area'],
  34: ['Prabhadevi', 'Siddhivinayak', 'Gokhale Rd'],
  35: ['Century Mills', 'Elphinstone Road (W)', 'Agripada (S)'],
  // Ward H/E — Bandra East
  36: ['Bandra East', 'Kherwadi', 'BKC (part)'],
  37: ['Kurla West (part)', 'Nehru Nagar', 'Vakola (part)'],
  38: ['Santacruz East', 'Vakola', 'Nehru Road'],
  39: ['Khar East', 'Kranti Nagar', 'CST Road'],
  40: ['Dharavi (E)', 'Sion-Bandra Link area', 'Kalanagar'],
  // Ward H/W — Bandra West
  41: ['Bandra West', 'Pali Hill', 'Mount Mary'],
  42: ['Khar West', 'Perry Cross Road', 'Linking Road (N)'],
  43: ['Santacruz West', 'Juhu Tara Road', 'Carter Road'],
  44: ['Reclamation', 'Chapel Road', 'Ranwar Village'],
  // Ward K/E — Andheri East / Sakinaka
  45: ['Andheri East (N)', 'Marol Military Road', 'Kondivita'],
  46: ['MIDC Andheri', 'Chakala', 'International Airport area'],
  47: ['JB Nagar', 'Guru Nanak Nagar', 'Nehru Nagar (Andheri)'],
  48: ['Sakinaka', 'Asalpha', 'Khairani Road'],
  49: ['Kurla (E)', 'Nehru Nagar Kurla', 'Kamani'],
  50: ['Powai (part)', 'Saki Vihar Road', 'Chandivali (part)'],
  // Ward K/W — Andheri West / Versova
  51: ['Andheri West', 'D. N. Nagar', 'Gilbert Hill'],
  52: ['Lokhandwala', 'Oshiwara', 'Andheri Market'],
  53: ['Versova', 'Four Bungalows', 'Seven Bungalows'],
  54: ['Juhu (part)', 'JVPD Scheme', 'Vile Parle (W) border'],
  55: ['Jogeshwari West', 'Pratap Nagar', 'Motilal Nagar (W)'],
  56: ['Goregaon West (border)', 'Film City Road', 'Aarey Road (part)'],
  // Ward L — Kurla / Saki Naka
  57: ['Kurla West', 'Bharat Nagar', 'Wadi'],
  58: ['Kurla East', 'Tilak Nagar Kurla', 'Lokmanya Nagar'],
  59: ['Saki Naka', 'Chandivali', 'Powai Lake border'],
  60: ['Ghatkopar West (border)', 'LBS Marg Kurla', 'Bail Bazaar'],
  61: ['Chunabhatti', 'Sion-Panvel Highway', 'Govandi border'],
  // Ward M/E — Govandi / Mankhurd
  62: ['Govandi', 'Shivaji Nagar Govandi', 'Baiganwadi'],
  63: ['Mankhurd', 'Natwar Parekh Colony', 'M/East boundary'],
  64: ['Deonar', 'Asalfa', 'Ramabai Nagar'],
  65: ['Trombay', 'Chembur Colony', 'Anushakti Nagar border'],
  66: ['Tata Colony Mankhurd', 'Mahul Village', 'Rafiq Nagar'],
  // Ward M/W — Chembur West
  67: ['Chembur', 'RCF Colony', 'Diamond Garden'],
  68: ['Tilak Nagar', 'Sion-Panvel Expressway area', 'Suman Nagar'],
  69: ['Sion Koliwada', 'Pratiksha Nagar', 'Chunabhatti (W)'],
  70: ['Mahul', 'Ambapada', 'Trombay Road'],
  // Ward N — Ghatkopar
  71: ['Ghatkopar East', 'Jawahar Nagar', 'Vikhroli border'],
  72: ['Ghatkopar West', 'LBS Marg', 'Pant Nagar'],
  73: ['Rajawadi', 'Shreyas Colony', 'Sarvoday Nagar'],
  74: ['Vikhroli West', 'Tagore Nagar', 'Gandhi Nagar Ghatkopar'],
  75: ['Asalpha', 'Ramabai Colony', 'Saki Naka border'],
  // Ward P/N — Malad East / Kandivali East
  76: ['MIDC Marol', 'Parashant Nagar', 'Sahakar Nagar Malad'],
  77: ['Malad East', 'Dindoshi', 'Kurar Village'],
  78: ['Kandivali East', 'Thakur Village', 'Samata Nagar'],
  79: ['Poisar', 'Mahindra Park', 'Charkop Sector 1'],
  80: ['Charkop', 'Charkop Sector 7-8', 'Eksar'],
  81: ['Kandivali East (S)', 'Lokhandwala Kandivali', 'IC Colony (part)'],
  // Ward P/S — Goregaon / Malad West
  82: ['Goregaon East', 'Aarey Colony', 'Film City'],
  84: ['Goregaon West', 'Motilal Nagar', 'Ram Mandir'],
  85: ['Malad West', 'Orlem', 'Marve Road'],
  86: ['Malad (S)', 'Chincholi Bunder', 'Malvani'],
  // Ward R/C — Kandivali West
  87: ['Kandivali West', 'Akurli Road', 'Poisar Gymkhana'],
  88: ['Dahisar (part)', 'Mira Rd border', 'Borivali Naka'],
  89: ['Borivali West (part)', 'Mandapeshwar', 'Devipada'],
  // Ward R/N — Borivali North / Dahisar
  90: ['Dahisar East', 'Sai Baba Nagar Dahisar', 'Rawalpada'],
  91: ['Dahisar West', 'Dahisar Checknaka', 'Anand Nagar Dahisar'],
  92: ['Borivali North', 'Poisar River area', 'Shimpoli (part)'],
  93: ['Borivali (E)', 'Kasturba Road Borivali', 'LIC Colony Borivali'],
  // Ward R/S — Borivali South
  94: ['Borivali South', 'IC Colony', 'Shimpoli'],
  95: ['Samata Nagar Borivali', 'Eksar Road', 'Borivali Station (W)'],
  96: ['Daulat Nagar', 'New Mhada Borivali', 'Poisar (S)'],
  97: ['Borivali (W) market', 'SV Road Borivali', 'Vazira Naka'],
  // Ward S — Vikhroli / Bhandup
  98:  ['Vikhroli East', 'Godrej Colony', 'Vikhroli Industrial Estate'],
  99:  ['Bhandup East', 'Nahur', 'Kanjurmarg (part)'],
  100: ['Bhandup West', 'Sonapur', 'LBS Marg Bhandup'],
  101: ['Powai', 'Hiranandani Gardens', 'IIT Bombay area'],
  102: ['Kanjurmarg', 'Lal Bahadur Shastri Road', 'Bhandup industrial'],
  // Ward T — Mulund
  103: ['Mulund East', 'Airoli Bridge area', 'Nahur Station'],
  104: ['Mulund West', 'Mulund Market', 'SV Road Mulund'],
  105: ['Mulund (N)', 'Sarvodaya Nagar Mulund', 'Kopri (border)'],
  106: ['Mulund Colony', 'LBS Marg Mulund', 'Veena Nagar'],
  107: ['Bhandup North', 'Sonapur (part)', 'Mulund Octroi'],
  108: ['Mulund (W) hills', 'Rambaug Colony', 'Tulsi Pipe Road'],
  // Remaining ward S entries (109–111)
  109: ['Vikhroli (S)', 'Tagore Nagar (S)', 'Pipe Road area'],
  110: ['Bhandup (S)', 'Kanjurmarg East', 'Nehru Nagar Bhandup'],
  111: ['Kanjurmarg West', 'Shubh Housing', 'LBS Marg (W)'],
  // Remaining ward N (112–115)
  112: ['Ghatkopar (N)', 'Vidya Vihar', 'Vikhroli link road'],
  113: ['Gandhi Nagar GK', 'Pant Nagar (N)', 'Tilak Nagar GK'],
  114: ['Rajawadi (N)', 'Hingwala Lane', 'Central Avenue GK'],
  115: ['Ghatkopar West (N)', 'Vikhroli W border', 'Khairani Road (N)'],
  // Remaining P/N (116–119)
  116: ['Malad East (N)', 'Jankalyan Nagar', 'Valnai'],
  117: ['Kandivali East (N)', 'Mahakali Caves area', 'Phadke Road'],
  118: ['Poisar (N)', 'Kandivali Station (E)', 'Pathanwadi'],
  119: ['Charkop (N)', 'Sector 4-5 Charkop', 'Eksar (N)'],
  // Remaining P/S (120–123)
  120: ['Goregaon East (N)', 'Cine Planet area', 'Jay Coach'],
  121: ['Film City (N)', 'Aarey Milk Colony', 'Goregaon (far E)'],
  122: ['Malad West (N)', 'Kharodi', 'Manori Road'],
  123: ['Malvani', 'Marve', 'Madh Island approach'],
  // Remaining R/C (124–126)
  124: ['Kandivali West (S)', 'Charkop (W)', 'Thakur Complex'],
  125: ['Borivali West (S)', 'Mandapeshwar (S)', 'Eksar (S)'],
  126: ['Dahisar (S) border', 'New Nagari Sahakari', 'Dahisar Naka'],
  // Remaining R/N (127–129)
  127: ['Dahisar East (S)', 'Rawalpada (S)', 'Penkarpada'],
  128: ['Anand Nagar Dahisar (S)', 'Checknaka (S)', 'SP Nagar'],
  129: ['Borivali North (S)', 'Nutan Nagar', 'Tata Garden'],
  // Remaining R/S (130–132)
  130: ['IC Colony (S)', 'Chandavarkar Road', 'Dhanukar Wadi'],
  131: ['Shimpoli (S)', 'Poisar (S-2)', 'New Mhada (S)'],
  132: ['Borivali SW', 'Western Express Highway (B)', 'SV Road (S)'],
  // K/E extras (133, 150, 151, 178, 179, 207)
  133: ['Sakinaka (S)', 'Mohili Village', 'Marol Naka'],
  150: ['Kurla East (S)', 'Vaze Colony', 'Shramik Nagar'],
  151: ['Kurla East (far)', 'Anand Nagar Kurla', 'Rajiv Gandhi Nagar Kurla'],
  178: ['MIDC Marol (S)', 'Marol Military Road (S)', 'Chakala (S)'],
  179: ['JB Nagar (S)', 'Nehru Nagar Andheri (S)', 'Andheri Kurla Road'],
  207: ['Sakinaka (N)', 'Gavanpada', 'Trombay Road (N)'],
  // B extras (134–136)
  134: ['Nagpada (E)', 'Agripada (E)', 'Bhim Chowk'],
  135: ['Byculla (N)', 'Mazagaon Dock area', 'Dockyard colony'],
  136: ['Masjid (E)', 'Mohammed Ali Road (N)', 'Musafirkhana (E)'],
  // C extras (137–138)
  137: ['Kalbadevi (S)', 'Zaveri Bazaar', 'Sheikh Memon St'],
  138: ['Pydhonie (E)', 'Bhendi Bazaar (N)', 'Mandvi (E)'],
  // E extras (139–140, 201)
  139: ['Byculla (W)', 'Kamathipura (S)', 'Nagpada (S)'],
  140: ['Sewri (S)', 'Antop Hill (S)', 'Hay Bunder'],
  201: ['Reay Road (S)', 'NM Joshi Marg (S)', 'Ambewadi'],
  // F/N extras (141–142, 202)
  141: ['Sion (S)', 'Matunga Labour Camp', 'Dharavi border F/N'],
  142: ['Dharavi (centre)', 'Kumbharwada', 'Muslim Society Dharavi'],
  202: ['Wadala (W)', 'Anik Village', 'Sewri (N)'],
  // F/S extras (143, 169, 170, 203)
  143: ['Naigaon (E)', 'Kamathipura', 'Falkland Road'],
  169: ['Lower Parel (S)', 'Senapati Bapat Marg (S)', 'Siddhivinayak area'],
  170: ['Worli Koliwada', 'Dr Annie Besant Road', 'Century Rayon'],
  203: ['Parel (S)', 'Ganesh Nagar (S)', 'Bhoiwada'],
  // G/N extras (144, 171, 199, 200)
  144: ['Dadar (E)', 'Naigaon East', 'Pant Nagar Dadar'],
  171: ['Mahim (N)', 'Bandra Terminus (N)', 'Kherwadi border'],
  199: ['Dharavi (SW)', 'Sion-Bandra junction', 'Dharavi main Rd'],
  200: ['Mahim (S)', 'Sitladevi Temple area', 'SV Road Mahim'],
  // G/S extras (145, 172, 173, 204)
  145: ['Worli (S)', 'Jacob Circle', 'Haji Ali area'],
  172: ['Prabhadevi (S)', 'Veer Savarkar Marg', 'Elphinstone (S)'],
  173: ['Worli Village', 'Atria (S)', 'Worli sea link end'],
  204: ['Prabhadevi (N)', 'Gokhale Road (N)', 'Sitladevi (N)'],
  // H/E extras (146–147, 174, 175, 205)
  146: ['Bandra East (N)', 'Bandra Reclamation', 'BKC (N)'],
  147: ['Santacruz East (N)', 'Kole Kalyan', 'MTNL building area'],
  174: ['Khar East (N)', 'Kranti Nagar (N)', 'CSIA road'],
  175: ['Dharavi (NE)', 'CST Road (N)', 'Kalanagar (N)'],
  205: ['Vakola (N)', 'Vile Parle East border', 'Nehru Road (N)'],
  // H/W extras (148–149, 176, 177, 206)
  148: ['Bandra West (N)', 'Pali Naka', 'St Andrews'],
  149: ['Khar West (N)', 'Turner Road', 'Hill Road (N)'],
  176: ['Santacruz West (N)', 'Vile Parle West border', 'SV Road (KW-N)'],
  177: ['Juhu (N)', 'JVPD (N)', 'Andheri-Juhu Road'],
  206: ['Reclamation (N)', 'Carter Road (N)', 'Bandstand'],
  // K/W extras (152–153, 180, 208)
  152: ['Andheri West (S)', 'DN Nagar (S)', 'Gilbert Hill (S)'],
  153: ['Oshiwara (S)', 'Lokhandwala (S)', 'Andheri Market (S)'],
  180: ['Versova (S)', 'Four Bungalows (S)', 'Andheri West Station'],
  208: ['Jogeshwari West (S)', 'Motilal Nagar (S)', 'Goregaon border'],
  // L extras (154–156, 181, 182, 209, 210)
  154: ['Kurla West (N)', 'Bharat Nagar (N)', 'Wadi (N)'],
  155: ['Saki Naka (N)', 'Chandivali (N)', 'Powai border'],
  156: ['Chunabhatti (N)', 'LBS Marg Kurla (S)', 'Ghatkopar border'],
  181: ['Kanjurmarg (N)', 'Sonapur (N)', 'Nahur (N)'],
  182: ['Powai (N)', 'Hiranandani (N)', 'Saki Vihar (N)'],
  209: ['Kurla East (N)', 'Tilak Nagar Kurla (N)', 'Sion Panvel Hwy Kurla'],
  210: ['Vikhroli West (N)', 'Tagore Nagar border', 'LBS Marg junction'],
  // M/E extras (157–158, 165–167, 185–187, 198, 211, 212)
  157: ['Govandi (N)', 'Shivaji Nagar (N)', 'Baiganwadi (N)'],
  158: ['Mankhurd (N)', 'Natwar Parekh (N)', 'Deonar (N)'],
  165: ['Trombay (N)', 'Chembur Colony (N)', 'Anushakti (N)'],
  166: ['Govandi (S)', 'Mahul Village (N)', 'Rafiq Nagar (N)'],
  167: ['Deonar (S)', 'Asalfa (N)', 'Ramabai (N)'],
  185: ['Govandi (E)', 'M/East far boundary', 'Pratikhsa Nagar'],
  186: ['Mankhurd (S)', 'Tata Colony (N)', 'Timber Depot'],
  187: ['Chembur (N)', 'RCF (N)', 'Trombay Village'],
  198: ['Govandi (W)', 'Sangharsh Nagar', 'Indira Nagar Govandi'],
  211: ['Mankhurd (E)', 'Deonar (E)', 'Dr Babasaheb Nagar'],
  212: ['Govandi Station area', 'Baiganwadi (E)', 'Shramik Nagar Govandi'],
  // M/W extras (159–162, 168, 183, 184, 196, 197, 213)
  159: ['Chembur (S)', 'Tilak Nagar (S)', 'Suman Nagar (S)'],
  160: ['Sion Koliwada (S)', 'Pratiksha Nagar (S)', 'Chunabhatti (S)'],
  161: ['Mahul (N)', 'Ambapada (N)', 'Trombay Rd (N)'],
  162: ['Chembur (W)', 'Diamond Garden (W)', 'RCF Colony (W)'],
  168: ['Tilak Nagar (N)', 'Suman Nagar (N)', 'Chembur Naka'],
  183: ['Sion Koliwada (N)', 'LBS Marg Chembur', 'Pratiksha (N)'],
  184: ['Mahul (S)', 'Ambapada (S)', 'ONGC colony'],
  196: ['Chembur East', 'Basant Park', 'EEH Service Road'],
  197: ['Ghatkopar-Chembur border', 'Vidyadhar Nagar', 'Priyadarshini Nagar'],
  213: ['Chunabhatti (M/W)', 'Dharavi boundary M/W', 'Kherwadi S'],
  // N extras (112–115, 163–164, 188–189, 214–215)
  163: ['Ghatkopar East (S)', 'Ramabai (S)', 'Saki Naka (S)'],
  164: ['Vikhroli East (S)', 'Tagore Nagar (E)', 'Pirojshanagar'],
  188: ['Ghatkopar West (S)', 'Pant Nagar (S)', 'LBS junction'],
  189: ['Rajawadi (S)', 'Vidya Vihar (S)', 'Hingwala Lane (S)'],
  214: ['Gandhi Nagar GK (S)', 'Tilak Nagar GK (S)', 'Ghatkopar N border'],
  215: ['Ghatkopar (far N)', 'Vikhroli (far N)', 'Kirol Road'],
  // P/N extras (116–119, 216)
  216: ['Kandivali East (far N)', 'Thakur Complex (N)', 'Valmiki Nagar'],
  // P/S extras (120–123, 190, 191, 217)
  190: ['Goregaon East (S)', 'Jay Coach (S)', 'Aarey (S)'],
  191: ['Malad West (S)', 'Orlem (S)', 'Marve Road (S)'],
  217: ['Malvani (S)', 'Malad (W) far', 'Jankalyan (S)'],
  // R/C extras (124–126, 192, 218)
  192: ['Kandivali West (N)', 'Charkop (N-W)', 'Thakur (N)'],
  218: ['Borivali West (N)', 'Mandapeshwar (N)', 'Eksar (N)'],
  // R/N extras (127–129, 193–194, 219)
  193: ['Dahisar East (N)', 'Rawalpada (N)', 'Francis Bunder Dahisar'],
  194: ['Borivali North (N)', 'Nutan Nagar (N)', 'Poisar (N)'],
  219: ['Anand Nagar Dahisar (N)', 'Dahisar Checknaka (N)', 'SP Nagar (N)'],
  // R/S extras (130–132, 195, 220)
  195: ['IC Colony (N)', 'Chandavarkar (N)', 'Borivali SW (N)'],
  220: ['Borivali (W) Station area', 'Vazira Naka (N)', 'Dhanukar Wadi (N)'],
  // A extras (225–227)
  225: ['Colaba (S)', 'Back Bay (S)', 'Afghan Church area (S)'],
  226: ['Cuffe Parade (S)', 'WTC (S)', 'Maker Towers'],
  227: ['Nariman Point (S)', 'Marine Lines (S)', 'Churchgate Station area'],
  // S extras (221–223)
  221: ['Vikhroli East (N)', 'Godrej (N)', 'Pipe Road (N)'],
  222: ['Bhandup West (N)', 'LBS (N)', 'Sonapur (N-2)'],
  223: ['Kanjurmarg (E)', 'Bhandup (E)', 'Nahur (E)'],
  // T extras (224)
  224: ['Mulund (E) far', 'Nahur (E)', 'Navi Mumbai border'],
};

// Lookup: get micro-areas for a given prabhag ward number
export function getMicroAreasByWardNo(wardNo: number): string[] {
  return PRABHAG_MICRO_AREAS[wardNo] ?? [];
}

// Lookup: get all prabhags for a given admin ward key
export function getPrabhagsByAdminWard(adminWard: string): PrabhagInfo[] {
  return MUMBAI_PRABHAGS.filter((p) => p.admin_ward === adminWard);
}

// Lookup: get MLA for a constituency name (partial match)
export function getMlaByConstituency(name: string): MlaInfo | undefined {
  const lower = name.toLowerCase();
  return MUMBAI_SUBURBAN_MLAS.find(
    (m) => m.constituency.toLowerCase().includes(lower) || lower.includes(m.constituency.split('-')[1]?.toLowerCase() ?? '')
  );
}

// Party → colour mapping for the badge
export const PARTY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  'BJP':              { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Shiv Sena':        { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  'Shiv Sena UBT':    { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  'Congress':         { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'NCP':              { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  'NCP (SP)':         { bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe' },
  'NCP (Ajit)':       { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  'Samajwadi Party':  { bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe' },
  'AIMIM':            { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  'MNS':              { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
};

export function getPartyStyle(party: string) {
  const key = party.replace('Nationalist Congress Sharadchandra Pawar', 'NCP (SP)')
                   .replace('Nationalist Congress Party (NCP)', 'NCP')
                   .replace('Nationalist Congress Party', 'NCP')
                   .replace('Shiv Sena Shinde Gat', 'Shiv Sena')
                   .replace('Bharatiya Janata Party', 'BJP')
                   .replace('Indian National Congress', 'Congress')
                   .replace('BJJP', 'BJP')
                   .replace('Nighut - BJP', 'BJP');
  return PARTY_COLOR[key] ?? { bg: '#f9fafb', text: '#374151', border: '#e5e7eb' };
}
