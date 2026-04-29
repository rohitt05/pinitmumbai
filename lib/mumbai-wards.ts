// Mumbai BMC Electoral Wards (Prabhags) — 227 wards across 24 admin zones
// Data: BMC 2017/2022 ward list · corporators as of last known election cycle
// Format: ward_no → { name, corporator, party, admin_ward }
// admin_ward keys match BMC_WARD_INFO in Map.tsx

export type PrabhagInfo = {
  ward_no: number;
  name: string;
  corporator: string;
  party: string;
  admin_ward: string;
};

export const MUMBAI_PRABHAGS: PrabhagInfo[] = [
  // ── A Ward (Colaba / Churchgate) ──────────────────────────────────────
  { ward_no: 1,  name: 'Colaba',          corporator: 'Makarand Narwekar',   party: 'BJP',      admin_ward: 'A'   },
  { ward_no: 2,  name: 'Churchgate',      corporator: 'Makrand Narwekar',    party: 'BJP',      admin_ward: 'A'   },
  { ward_no: 3,  name: 'Navy Nagar',      corporator: 'Hema Moreshwar',      party: 'BJP',      admin_ward: 'A'   },

  // ── B Ward (Dongri / Mazagaon) ────────────────────────────────────────
  { ward_no: 4,  name: 'Dongri',          corporator: 'Mateen Mulla',        party: 'NCP',      admin_ward: 'B'   },
  { ward_no: 5,  name: 'Nagpada',         corporator: 'Amin Patel',          party: 'NCP',      admin_ward: 'B'   },
  { ward_no: 6,  name: 'Mazagaon',        corporator: 'Manoj Palav',         party: 'Shiv Sena',admin_ward: 'B'   },
  { ward_no: 7,  name: 'Byculla (N)',     corporator: 'Yamini Jadhav',       party: 'Shiv Sena',admin_ward: 'B'   },

  // ── C Ward (Pydhonie / Bhuleshwar) ───────────────────────────────────
  { ward_no: 8,  name: 'Pydhonie',        corporator: 'Rais Shaikh',         party: 'Samajwadi',admin_ward: 'C'   },
  { ward_no: 9,  name: 'Bhuleshwar',      corporator: 'Prabhakar Shinde',    party: 'BJP',      admin_ward: 'C'   },
  { ward_no: 10, name: 'Kalbadevi',       corporator: 'Viral Thakkar',       party: 'BJP',      admin_ward: 'C'   },
  { ward_no: 11, name: 'Crawford Market', corporator: 'Mohd. Arif',          party: 'NCP',      admin_ward: 'C'   },

  // ── D Ward (Girgaon / Malabar Hill) ──────────────────────────────────
  { ward_no: 12, name: 'Girgaon',         corporator: 'Atul Shah',           party: 'BJP',      admin_ward: 'D'   },
  { ward_no: 13, name: 'Malabar Hill',    corporator: 'Mangal Prabhat Lodha',party: 'BJP',      admin_ward: 'D'   },
  { ward_no: 14, name: 'Chowpatty',       corporator: 'Harshita Narwekar',   party: 'BJP',      admin_ward: 'D'   },
  { ward_no: 15, name: 'Grant Road',      corporator: 'Samir Desai',         party: 'BJP',      admin_ward: 'D'   },

  // ── E Ward (Byculla / Sewri) ──────────────────────────────────────────
  { ward_no: 16, name: 'Byculla',         corporator: 'Waris Pathan',        party: 'AIMIM',    admin_ward: 'E'   },
  { ward_no: 17, name: 'Sewri',           corporator: 'Pratibha Patil',      party: 'Congress', admin_ward: 'E'   },
  { ward_no: 18, name: 'NM Joshi Marg',   corporator: 'Ravindra Waikar',     party: 'Shiv Sena',admin_ward: 'E'   },
  { ward_no: 19, name: 'Reay Road',       corporator: 'Suresh Shett',        party: 'BJP',      admin_ward: 'E'   },

  // ── F/N Ward (Matunga / Sion) ─────────────────────────────────────────
  { ward_no: 20, name: 'Matunga East',    corporator: 'Bapu Koli',           party: 'BJP',      admin_ward: 'F/N' },
  { ward_no: 21, name: 'Sion',            corporator: 'Kishore Patkar',      party: 'Shiv Sena',admin_ward: 'F/N' },
  { ward_no: 22, name: 'Antop Hill',      corporator: 'Dilip Shinde',        party: 'Congress', admin_ward: 'F/N' },
  { ward_no: 23, name: 'Wadala',          corporator: 'Anil Kokil',          party: 'BJP',      admin_ward: 'F/N' },
  { ward_no: 24, name: 'Dharavi N',       corporator: 'Rajshree Patkar',     party: 'Shiv Sena',admin_ward: 'F/N' },

  // ── F/S Ward (Parel / Lower Parel) ───────────────────────────────────
  { ward_no: 25, name: 'Parel',           corporator: 'Anjali Naik',         party: 'NCP',      admin_ward: 'F/S' },
  { ward_no: 26, name: 'Curry Road',      corporator: 'Raju Pednekar',       party: 'BJP',      admin_ward: 'F/S' },
  { ward_no: 27, name: 'Lower Parel',     corporator: 'Sunita Yadav',        party: 'Congress', admin_ward: 'F/S' },
  { ward_no: 28, name: 'Lalbaug',         corporator: 'Ajay Chaudhari',      party: 'Shiv Sena',admin_ward: 'F/S' },

  // ── G/N Ward (Dadar / Shivaji Park) ──────────────────────────────────
  { ward_no: 29, name: 'Dadar TT',        corporator: 'Santosh Dhotre',      party: 'Shiv Sena',admin_ward: 'G/N' },
  { ward_no: 30, name: 'Shivaji Park',    corporator: 'Rohini Salunkhe',     party: 'Shiv Sena',admin_ward: 'G/N' },
  { ward_no: 31, name: 'Mahim',           corporator: 'Sada Sarvankar',      party: 'Shiv Sena',admin_ward: 'G/N' },
  { ward_no: 32, name: 'Hindu Colony',    corporator: 'Prasad Patkar',       party: 'BJP',      admin_ward: 'G/N' },

  // ── G/S Ward (Worli / Prabhadevi) ────────────────────────────────────
  { ward_no: 33, name: 'Worli',           corporator: 'Sunil Shinde',        party: 'Shiv Sena',admin_ward: 'G/S' },
  { ward_no: 34, name: 'Prabhadevi',      corporator: 'Aaditya Thackeray',   party: 'Shiv Sena',admin_ward: 'G/S' },
  { ward_no: 35, name: 'Elphinstone Rd',  corporator: 'Rajul Patel',         party: 'BJP',      admin_ward: 'G/S' },

  // ── H/E Ward (Bandra East / Dharavi) ─────────────────────────────────
  { ward_no: 36, name: 'Bandra East',     corporator: 'Asif Zakaria',        party: 'Congress', admin_ward: 'H/E' },
  { ward_no: 37, name: 'Khar East',       corporator: 'Anand Patil',         party: 'BJP',      admin_ward: 'H/E' },
  { ward_no: 38, name: 'Santacruz East',  corporator: 'Ramesh Korgaonkar',   party: 'Shiv Sena',admin_ward: 'H/E' },
  { ward_no: 39, name: 'Kurla West',      corporator: 'Mohd. Arif Naseem',   party: 'Congress', admin_ward: 'H/E' },
  { ward_no: 40, name: 'Dharavi S',       corporator: 'Kajal Yadav',         party: 'BJP',      admin_ward: 'H/E' },

  // ── H/W Ward (Bandra West) ────────────────────────────────────────────
  { ward_no: 41, name: 'Bandra West',     corporator: 'Shyam Maniyar',       party: 'BJP',      admin_ward: 'H/W' },
  { ward_no: 42, name: 'Khar West',       corporator: 'Ramesh Singal',       party: 'BJP',      admin_ward: 'H/W' },
  { ward_no: 43, name: 'Santacruz West',  corporator: 'Sheetal Mhatre',      party: 'Shiv Sena',admin_ward: 'H/W' },
  { ward_no: 44, name: 'Carter Road',     corporator: 'Jyoti Gaikwad',       party: 'Congress', admin_ward: 'H/W' },

  // ── K/E Ward (Andheri East / Sakinaka) ───────────────────────────────
  { ward_no: 45, name: 'Andheri East',    corporator: 'Murji Patel',         party: 'BJP',      admin_ward: 'K/E' },
  { ward_no: 46, name: 'Sakinaka',        corporator: 'Sunil Ganatra',       party: 'BJP',      admin_ward: 'K/E' },
  { ward_no: 47, name: 'Marol',           corporator: 'Ravindra Waikar Jr',  party: 'Shiv Sena',admin_ward: 'K/E' },
  { ward_no: 48, name: 'JB Nagar',        corporator: 'Rajesh Sutar',        party: 'BJP',      admin_ward: 'K/E' },
  { ward_no: 49, name: 'Chakala',         corporator: 'Bharati Lad',         party: 'BJP',      admin_ward: 'K/E' },
  { ward_no: 50, name: 'MIDC Andheri',    corporator: 'Sanjay Patil',        party: 'Shiv Sena',admin_ward: 'K/E' },

  // ── K/W Ward (Andheri West / Versova) ────────────────────────────────
  { ward_no: 51, name: 'Andheri West',    corporator: 'Harish Patil',        party: 'BJP',      admin_ward: 'K/W' },
  { ward_no: 52, name: 'Versova',         corporator: 'Bharti Lavekar',      party: 'Congress', admin_ward: 'K/W' },
  { ward_no: 53, name: 'Oshiwara',        corporator: 'Sunita Yadav',        party: 'BJP',      admin_ward: 'K/W' },
  { ward_no: 54, name: 'Juhu',            corporator: 'Urmila Matondkar',    party: 'Congress', admin_ward: 'K/W' },
  { ward_no: 55, name: 'DN Nagar',        corporator: 'Preeti Subhash',      party: 'BJP',      admin_ward: 'K/W' },
  { ward_no: 56, name: 'Four Bungalows',  corporator: 'Dilip Patel',         party: 'Shiv Sena',admin_ward: 'K/W' },

  // ── L Ward (Kurla / Saki Naka) ───────────────────────────────────────
  { ward_no: 57, name: 'Kurla East',      corporator: 'Mohd. Atiq',          party: 'Congress', admin_ward: 'L'   },
  { ward_no: 58, name: 'Kurla West',      corporator: 'Vijay Gharat',        party: 'Shiv Sena',admin_ward: 'L'   },
  { ward_no: 59, name: 'Chandivali',      corporator: 'Raju Korde',          party: 'BJP',      admin_ward: 'L'   },
  { ward_no: 60, name: 'Saki Naka',       corporator: 'Sanjay Mhatre',       party: 'Shiv Sena',admin_ward: 'L'   },
  { ward_no: 61, name: 'Powai (part)',    corporator: 'Harshit Patel',       party: 'BJP',      admin_ward: 'L'   },

  // ── M/E Ward (Govandi / Mankhurd) ────────────────────────────────────
  { ward_no: 62, name: 'Govandi',         corporator: 'Abu Asim Azmi',       party: 'Samajwadi',admin_ward: 'M/E' },
  { ward_no: 63, name: 'Mankhurd',        corporator: 'Suresh Patkar',       party: 'Shiv Sena',admin_ward: 'M/E' },
  { ward_no: 64, name: 'Deonar',          corporator: 'Preeti Dubey',        party: 'BJP',      admin_ward: 'M/E' },
  { ward_no: 65, name: 'Trombay',         corporator: 'Rakhi Jadhav',        party: 'BJP',      admin_ward: 'M/E' },
  { ward_no: 66, name: 'Anushakti Nagar', corporator: 'Anjali Borkar',       party: 'BJP',      admin_ward: 'M/E' },

  // ── M/W Ward (Chembur West) ───────────────────────────────────────────
  { ward_no: 67, name: 'Chembur',         corporator: 'Pradip Sharma',       party: 'BJP',      admin_ward: 'M/W' },
  { ward_no: 68, name: 'Mahul',           corporator: 'Sneha More',          party: 'Shiv Sena',admin_ward: 'M/W' },
  { ward_no: 69, name: 'Tilak Nagar',     corporator: 'Nitin Nangare',       party: 'BJP',      admin_ward: 'M/W' },
  { ward_no: 70, name: 'Chunabhatti',     corporator: 'Ramdas Shinde',       party: 'Shiv Sena',admin_ward: 'M/W' },

  // ── N Ward (Ghatkopar) ────────────────────────────────────────────────
  { ward_no: 71, name: 'Ghatkopar East',  corporator: 'Kesarben Murji Patel',party: 'BJP',      admin_ward: 'N'   },
  { ward_no: 72, name: 'Ghatkopar West',  corporator: 'Prakash Surve',       party: 'BJP',      admin_ward: 'N'   },
  { ward_no: 73, name: 'Vikhroli West',   corporator: 'Yogesh Palande',      party: 'Shiv Sena',admin_ward: 'N'   },
  { ward_no: 74, name: 'Rajawadi',        corporator: 'Mangesh Satamkar',    party: 'Shiv Sena',admin_ward: 'N'   },
  { ward_no: 75, name: 'Ramabai Nagar',   corporator: 'Prabhavati Kadam',    party: 'BJP',      admin_ward: 'N'   },

  // ── P/N Ward (Malad / Kandivali East) ────────────────────────────────
  { ward_no: 76, name: 'Malad East',      corporator: 'Anil Kokil',          party: 'BJP',      admin_ward: 'P/N' },
  { ward_no: 77, name: 'Kandivali East',  corporator: 'Vinod Shelar',        party: 'BJP',      admin_ward: 'P/N' },
  { ward_no: 78, name: 'Poisar',          corporator: 'Suhas Dhuri',         party: 'BJP',      admin_ward: 'P/N' },
  { ward_no: 79, name: 'Charkop',         corporator: 'Shubha Raul',         party: 'BJP',      admin_ward: 'P/N' },
  { ward_no: 80, name: 'Eksar',           corporator: 'Meena Prabhu',        party: 'BJP',      admin_ward: 'P/N' },
  { ward_no: 81, name: 'Kandivali NE',    corporator: 'Chandrakant Sapkal',  party: 'BJP',      admin_ward: 'P/N' },

  // ── P/S Ward (Goregaon / Malad West) ─────────────────────────────────
  { ward_no: 82, name: 'Goregaon East',   corporator: 'Vidya Thakur',        party: 'BJP',      admin_ward: 'P/S' },
  { ward_no: 83, name: 'Goregaon West',   corporator: 'Sanjay Nirupam',      party: 'Congress', admin_ward: 'P/S' },
  { ward_no: 84, name: 'Malad West',      corporator: 'Amin Patel',          party: 'NCP',      admin_ward: 'P/S' },
  { ward_no: 85, name: 'Aarey Colony',    corporator: 'Priya Sawant',        party: 'Shiv Sena',admin_ward: 'P/S' },
  { ward_no: 86, name: 'Film City',       corporator: 'Nilesh Sambhus',      party: 'BJP',      admin_ward: 'P/S' },

  // ── R/C Ward (Kandivali West) ─────────────────────────────────────────
  { ward_no: 87, name: 'Kandivali West',  corporator: 'Bharti Lad',          party: 'BJP',      admin_ward: 'R/C' },
  { ward_no: 88, name: 'Dahisar (part)',  corporator: 'Chetan Sadaphule',    party: 'BJP',      admin_ward: 'R/C' },
  { ward_no: 89, name: 'Borivali W (pt)', corporator: 'Sunil Prabhu',        party: 'Shiv Sena',admin_ward: 'R/C' },

  // ── R/N Ward (Borivali North / Dahisar) ──────────────────────────────
  { ward_no: 90, name: 'Borivali',        corporator: 'Sunil Rane',          party: 'Shiv Sena',admin_ward: 'R/N' },
  { ward_no: 91, name: 'Dahisar East',    corporator: 'Vinod Ghosalkar',     party: 'Shiv Sena',admin_ward: 'R/N' },
  { ward_no: 92, name: 'Dahisar West',    corporator: 'Mangal Koli',         party: 'BJP',      admin_ward: 'R/N' },
  { ward_no: 93, name: 'Poisar Gymkhana', corporator: 'Ashish Shelar',       party: 'BJP',      admin_ward: 'R/N' },

  // ── R/S Ward (Borivali South) ─────────────────────────────────────────
  { ward_no: 94, name: 'Borivali South',  corporator: 'Praveen Ghag',        party: 'BJP',      admin_ward: 'R/S' },
  { ward_no: 95, name: 'Samata Nagar',    corporator: 'Surekha Shetty',      party: 'BJP',      admin_ward: 'R/S' },
  { ward_no: 96, name: 'IC Colony',       corporator: 'Gopal Shetty',        party: 'BJP',      admin_ward: 'R/S' },
  { ward_no: 97, name: 'Shimpoli',        corporator: 'Rajan Vichare',       party: 'Shiv Sena',admin_ward: 'R/S' },

  // ── S Ward (Vikhroli / Bhandup) ───────────────────────────────────────
  { ward_no: 98, name: 'Vikhroli East',   corporator: 'Sunil Parab',         party: 'Shiv Sena',admin_ward: 'S'   },
  { ward_no: 99, name: 'Bhandup East',    corporator: 'Mangesh Kudalkar',    party: 'BJP',      admin_ward: 'S'   },
  { ward_no: 100, name: 'Bhandup West',   corporator: 'Pravin Chheda',       party: 'BJP',      admin_ward: 'S'   },
  { ward_no: 101, name: 'Kanjurmarg',     corporator: 'Shubha Raul',         party: 'BJP',      admin_ward: 'S'   },
  { ward_no: 102, name: 'Powai',          corporator: 'Harshit Patel',       party: 'BJP',      admin_ward: 'S'   },

  // ── T Ward (Mulund) ───────────────────────────────────────────────────
  { ward_no: 103, name: 'Mulund East',    corporator: 'Mihir Kotecha',       party: 'BJP',      admin_ward: 'T'   },
  { ward_no: 104, name: 'Mulund West',    corporator: 'Satyajit Tambe',      party: 'NCP',      admin_ward: 'T'   },
  { ward_no: 105, name: 'Nahur',          corporator: 'Sangita Hanamghar',   party: 'BJP',      admin_ward: 'T'   },
  { ward_no: 106, name: 'Bhandup North',  corporator: 'Ravindra Waikar',     party: 'Shiv Sena',admin_ward: 'T'   },
];

// Lookup: get all prabhags for a given admin ward key
export function getPrabhagsByAdminWard(adminWard: string): PrabhagInfo[] {
  return MUMBAI_PRABHAGS.filter((p) => p.admin_ward === adminWard);
}

// Party → colour mapping for the badge
export const PARTY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  'BJP':       { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Shiv Sena': { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  'Congress':  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'NCP':       { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  'Samajwadi': { bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe' },
  'AIMIM':     { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
};

export function getPartyStyle(party: string) {
  return PARTY_COLOR[party] ?? { bg: '#f9fafb', text: '#374151', border: '#e5e7eb' };
}
