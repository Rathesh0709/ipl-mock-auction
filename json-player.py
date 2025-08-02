import csv
import json
from datetime import datetime
from typing import List, Dict, Any

# Replace this multiline string with your actual CSV data
csv_data = """101,15,WK2,Shai,Hope,West Indies,,11/10/1993,31,WICKETKEEPER,RHB,,38,128,36,9,DC,DC,9,Capped,125
102,15,WK2,Josh,Inglis,Australia,,3/4/1995,30,WICKETKEEPER,RHB,,,23,26,,,,,Capped,200
103,15,WK2,Ryan,Rickelton,South Africa,,7/11/1996,28,WICKETKEEPER,LHB,,7,5,8,,,,,Capped,100
104,16,FA2,Deepak,Chahar,India,RCA,8/7/1992,32,BOWLER,RHB,RIGHT ARM Fast Medium,,13,25,81,"RPS,CSK",CSK,8,Capped,200
105,16,FA2,Gerald,Coetzee,South Africa,,10/2/2000,24,BOWLER,RHB,RIGHT ARM Fast,3,14,6,10,MI,Mi,10,Capped,125
106,16,FA2,Akash,Deep,India,CAB,12/15/1996,28,BOWLER,RHB,RIGHT ARM Fast,4,,,8,RCB,RCB,1,Capped,100
107,16,FA2,Tushar,Deshpande,India,MCA,5/15/1995,29,BOWLER,LHB,RIGHT ARM Fast,,,2,36,"DC,CSK",CSK,13,Capped,100
108,16,FA2,Lockie,Ferguson,New Zealand,,6/13/1991,33,BOWLER,RHB,RIGHT ARM Fast,1,65,42,45,"RPS,GT,KKR,RCB",RCB,7,Capped,200
109,16,FA2,Bhuvneshwar,Kumar,India,UPCA,2/5/1990,35,BOWLER,RHB,RIGHT ARM Fast Medium,21,121,87,176,"PWI,SRH",SRH,16,Capped,200
110,16,FA2,Mukesh,Kumar,India,CAB,10/12/1993,31,BOWLER,RHB,RIGHT ARM Fast Medium,3,6,17,20,DC,DC,10,Capped,200
111,17,SP2,Allah,Ghazanfar,Afghanistan,,3/20/2006,19,BOWLER,RHB,RIGHT ARM Off Spin,,5,0,0,KKR,KKR,0,Capped,75
112,17,SP2,Akeal,Hosein,West Indies,,4/25/1993,31,BOWLER,LHB,LEFT ARM Slow Orthodox,,38,60,1,SRH,,,Capped,150
113,17,SP2,Keshav,Maharaj,South Africa,,2/7/1990,35,BOWLER,RHB,LEFT ARM Slow Orthodox,54,44,35,2,RR,RR,2,Capped,75
114,17,SP2,Mujeeb Ur,Rahman,Afghanistan,,3/28/2001,24,BOWLER,RHB,RIGHT ARM Off Spin,1,75,46,19,"PBKS,SRH,KKR",,,Capped,200
115,17,SP2,Adil,Rashid,England,,2/17/1988,37,BOWLER,RHB,RIGHT ARM Leg Spin,19,141,116,3,"PBKS,SRH",,,Capped,200
116,17,SP2,Vijayakanth,Viyaskanth,Sri Lanka,,12/5/2001,23,BOWLER,RHB,RIGHT ARM Leg Spin,,,1,3,SRH,SRH,3,Capped,75
117,18,UBA2,Ricky,Bhui,India,ACA,9/29/1996,28,BATTER,RHB,,,,,4,"SRH,DC",DC,2,Uncapped,30
118,18,UBA2,Swastik,Chhikara,India,UPCA,4/3/2005,20,BATTER,RHB,RIGHT ARM Off Spin,,,,0,DC,DC,0,Uncapped,30
119,18,UBA2,Aarya,Desai,India,GUCA,4/3/2003,22,BATTER,LHB,RIGHT ARM Off Spin,,,,0,KKR,,,Uncapped,30
120,18,UBA2,Shubham,Dubey,India,VCA,8/27/1994,30,BATTER,LHB,RIGHT ARM Off Spin,,,,4,RR,RR,0,Uncapped,30
121,18,UBA2,Madhav,Kaushik,India,UPCA,1/3/1998,27,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
122,18,UBA2,Pukhraj,Mann,India,PCA,6/7/2001,23,BATTER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
123,18,UBA2,Shaik,Rasheed,India,ACA,9/24/2004,20,BATTER,RHB,RIGHT ARM Leg Spin,,,,0,CSK,CSK,0,Uncapped,30
124,18,UBA2,Himmat,Singh,India,DDCA,11/8/1996,28,BATTER,RHB,RIGHT ARM Off Spin,,,,0,RCB,,,Uncapped,30
125,19,UAL2,Mayank,Dagar,India,HPCA,11/11/1996,28,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,8,"PBKS,SRH,RCB",RCB,5,Uncapped,30
126,19,UAL2,Anshul,Kamboj,India,HCA,12/6/2000,24,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,3,MI,MI,3,Uncapped,30
127,19,UAL2,Mohd. Arshad,Khan,India,MPCA,12/20/1997,27,ALL-ROUNDER,LHB,LEFT ARM Fast Medium,,,,10,"MI,LSG",LSG,4,Uncapped,30
128,19,UAL2,Darshan,Nalkande,India,VCA,10/4/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,5,"PBKS,GT",GT,3,Uncapped,30
129,19,UAL2,Suyash,Prabhudessai,India,GCA,12/6/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,1,RCB,RCB,11,Uncapped,30
130,19,UAL2,Anukul,Roy,India,JSCA,11/30/1998,26,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,11,"MI,KKR",KKR,4,Uncapped,30
131,19,UAL2,Swapnil,Singh,India,CAU,1/22/1991,34,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,14,"PBKS,LSG,RCB",PBKS,7,Uncapped,30
132,19,UAL2,Sanvir,Singh,India,PCA,10/12/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,6,SRH,SRH,4,Uncapped,30
133,20,UWK2,Avanish,Aravelly,India,HYCA,6/2/2005,19,WICKETKEEPER,LHB,RIGHT ARM Off Spin,,,,0,,CSK,0,Uncapped,30
134,20,UWK2,Vansh,Bedi,India,DDCA,12/23/2002,22,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
135,20,UWK2,Saurav,Chauhan,India,GUCA,5/27/2000,24,WICKETKEEPER,LHB,RIGHT ARM Off Spin,,,,3,RCB,RCB,3,Uncapped,30
136,20,UWK2,Harvik,Desai,India,SCA,10/4/1999,25,WICKETKEEPER,RHB,,,,,0,MI,MI,0,Uncapped,30
137,20,UWK2,Tom,Kohler-Cadmore,England,,8/19/1994,30,WICKETKEEPER,RHB,,,,,4,RR,RR,4,Uncapped,50
138,20,UWK2,Kunal,Rathore,India,RCA,10/9/2002,22,WICKETKEEPER,LHB,RIGHT ARM Off Spin,,,,0,RR,RR,0,Uncapped,30
139,20,UWK2,B.R,Sharath,India,KSCA,9/28/1996,28,WICKETKEEPER,RHB,,,,,1,GT,GT,1,Uncapped,30
140,21,UFA2,Gurnoor Singh,Brar,India,PCA,5/25/2000,24,BOWLER,LHB,RIGHT ARM Fast,,,,1,"PBKS,GT",GT,0,Uncapped,30
141,21,UFA2,Mukesh,Choudhary,India,MACA,7/6/1996,28,BOWLER,LHB,LEFT ARM Fast,,,,14,CSK,CSK,1,Uncapped,30
142,21,UFA2,Sakib,Hussain,India,BICA,12/14/2004,20,BOWLER,RHB,RIGHT ARM Fast Medium,,,,0,KKR,KKR,0,Uncapped,30
143,21,UFA2,Vidwath,Kaverappa,India,KSCA,2/25/1999,26,BOWLER,RHB,RIGHT ARM Fast Medium,,,,1,PBKS,PBKS,1,Uncapped,30
144,21,UFA2,Rajan,Kumar,India,CAU,7/8/1996,28,BOWLER,LHB,LEFT ARM Fast,,,,0,RCB,RCB,0,Uncapped,30
145,21,UFA2,Sushant,Mishra,India,JSCA,12/23/2000,24,BOWLER,LHB,LEFT ARM Fast,,,,0,GT,GT,0,Uncapped,30
146,21,UFA2,Arjun,Tendulkar,India,GCA,9/24/1999,25,BOWLER,LHB,LEFT ARM Fast Medium,,,,5,MI,MI,1,Uncapped,30
147,22,USP2,Zeeshan,Ansari,India,UPCA,12/16/1999,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
148,22,USP2,Prince,Choudhary,India,DDCA,9/29/1999,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,0,PBKS,PBKS,0,Uncapped,30
149,22,USP2,Himanshu,Sharma,India,RCA,6/6/1998,26,BOWLER,RHB,RIGHT ARM Leg Spin,,,,1,RCB,RCB,1,Uncapped,30
150,22,USP2,M.,Siddharth,India,TNCA,7/3/1998,26,BOWLER,RHB,LEFT ARM Slow Orthodox,,,,3,"KKR,DC,LSG",LSG,3,Uncapped,30
151,22,USP2,Digvesh,Singh,India,DDCA,12/15/1999,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
152,22,USP2,Prashant,Solanki,India,MACA,2/22/2000,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,2,CSK,CSK,0,Uncapped,30
153,22,USP2,Jhathavedh,Subramanyan,India,TNCA,9/16/1999,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,0,SRH,SRH,0,Uncapped,30
154,23,BA3,Finn,Allen,New Zealand,,4/22/1999,25,BATTER,RHB,,,22,47,0,RCB,,,Capped,200
155,23,BA3,Dewald,Brevis,South Africa,,4/29/2003,21,BATTER,RHB,RIGHT ARM Leg Spin,,,2,10,MI,MI,3,Capped,75
156,23,BA3,Ben,Duckett,England,,10/17/1994,30,BATTER,LHB,,29,16,12,,,,,Capped,200
157,23,BA3,Manish,Pandey,India,KSCA,9/10/1989,35,BATTER,RHB,,,29,39,171,"MI,RCB,PWI, SRH, LSG,DC,KKR",KKR,1,Capped,75
158,23,BA3,Rilee,Rossouw,South Africa,,10/9/1989,35,BATTER,LHB,,,36,29,22,"RCB,DC,PBKS",PBKS,8,Capped,200
159,23,BA3,Sherfane,Rutherford,West Indies,,8/15/1998,26,BATTER,LHB,RIGHT ARM Fast Medium,,8,24,10,"DC,MI,RR,RCB,KKR",KKR,0,Capped,150
160,23,BA3,Ashton,Turner,Australia,,1/25/1993,32,BATTER,RHB,RIGHT ARM Off Spin,,9,19,6,"RR,LSG",LSG,2,Capped,100
161,23,BA3,James,Vince,England,,3/14/1991,34,BATTER,RHB,,13,25,17,,,,,Capped,200
162,24,AL3,Shahbaz,Ahamad,India,CAB,12/11/1994,30,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,3,2,55,"RCB,SRH",SRH,16,Capped,100
163,24,AL3,Moeen,Ali,England,,6/18/1987,37,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,68,138,92,67,"RCB,CSK",CSK,8,Capped,200
164,24,AL3,Tim,David,Australia,,3/16/1996,29,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,4,51,38,"RCB,MI",MI,13,Capped,200
165,24,AL3,Deepak,Hooda,India,RCA,4/19/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,10,21,118,"RR,SRH,PBKS,LSG",LSG,11,Capped,75
166,24,AL3,Will,Jacks,England,,11/21/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,2,13,18,8,RCB,RCB,8,Capped,200
167,24,AL3,Azmatullah,Omarzai,Afghanistan,,3/24/2000,25,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,30,44,7,GT,GT,7,Capped,150
168,24,AL3,R.,Sai Kishore,India,TNCA,11/6/1996,28,ALL-ROUNDER,LHB,LEFT ARM Slow Unorthodox,,,3,10,"CSK,GT",GT,5,Capped,75
169,24,AL3,Romario,Shepherd,West Indies,,11/26/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Fast,,33,46,10,"SRH,LSG,MI",MI,6,Capped,150
170,25,WK3,Tom,Banton,England,,11/11/1998,26,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,6,14,2,KKR,,,Capped,200
171,25,WK3,Sam,Billings,England,,6/15/1991,33,WICKETKEEPER,RHB,,3,28,37,30,"CSK,DC,KKR",,,Capped,150
172,25,WK3,Jordan,Cox,England,,10/21/2000,24,WICKETKEEPER,RHB,,,2,2,,,,,Capped,125
173,25,WK3,Ben,McDermott,Australia,,12/12/1994,30,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,5,25,,,,,Capped,75
174,25,WK3,Kusal,Mendis,Sri Lanka,,2/2/1995,30,WICKETKEEPER,RHB,RIGHT ARM Leg Spin,67,134,73,,,,,Capped,75
175,25,WK3,Kusal,Perera,Sri Lanka,,8/17/1990,34,WICKETKEEPER,LHB,,22,116,72,2,RR,,,Capped,75
176,25,WK3,Josh,Philippe,Australia,,6/1/1997,27,WICKETKEEPER,RHB,,,3,12,5,RCB,,,Capped,75
177,25,WK3,Tim,Seifert,New Zealand,,12/14/1994,30,WICKETKEEPER,RHB,,,3,61,3,"KKR,DC",,,Capped,125
178,26,FA3,Nandre,Burger,South Africa,,8/11/1995,29,BOWLER,LHB,LEFT ARM Fast,3,5,2,6,RR,RR,6,Capped,125
179,26,FA3,Spencer,Johnson,Australia,,12/16/1995,29,BOWLER,LHB,LEFT ARM Fast,,1,5,5,GT,GT,5,Capped,200
180,26,FA3,Umran,Malik,India,JKCA,11/22/1999,25,BOWLER,RHB,RIGHT ARM Fast,,10,8,26,SRH,SRH,1,Capped,75
181,26,FA3,Mustafizur,Rahman,Bangladesh,,9/6/1995,29,BOWLER,LHB,LEFT ARM Fast,15,104,106,57,"SRH,MI,RR,DC,CSK",CSK,9,Capped,200
182,26,FA3,Ishant,Sharma,India,DDCA,9/2/1988,36,BOWLER,RHB,RIGHT ARM Fast,105,80,14,109,"KKR,DCH,SRH,RPS,PBKS,DC",DC,9,Capped,75
183,26,FA3,Nuwan,Thushara,Sri Lanka,,8/6/1994,30,BOWLER,RHB,RIGHT ARM Fast,,,13,7,MI,MI,7,Capped,75
184,26,FA3,Naveen,Ul Haq,Afghanistan,,9/23/1999,25,BOWLER,RHB,RIGHT ARM Medium,,14,45,18,LSG,LSG,10,Capped,200
185,26,FA3,Jaydev,Unadkat,India,SCA,10/18/1991,33,BOWLER,RHB,LEFT ARM Fast Medium,4,8,10,105,"RCB,DC,KKR,RPS,RR,MI,LSG,SRH",SRH,11,Capped,100
186,26,FA3,Umesh,Yadav,India,VCA,10/25/1987,37,BOWLER,RHB,RIGHT ARM Fast Medium,57,75,9,148,"RCB,DC,KKR,GT",GT,7,Capped,200
187,27,SP3,Rishad,Hossain,Bangladesh,,7/15/2002,22,BOWLER,RHB,RIGHT ARM Leg Spin,,3,27,,,,,Capped,75
188,27,SP3,Zahir Khan,Pakten,Afghanistan,,12/20/1998,26,BOWLER,LHB,LEFT ARM Slow Unorthodox,5,1,4,0,RR,,,Capped,75
189,27,SP3,Nqabayomzi,Peter,South Africa,,12/9/2001,23,BOWLER,RHB,RIGHT ARM Leg Spin,,2,6,,,,,Capped,75
190,27,SP3,Tanveer,Sangha,Australia,,11/26/2001,23,BOWLER,RHB,RIGHT ARM Leg Spin,,2,7,,,,,Capped,75
191,27,SP3,Tabraiz,Shamsi,South Africa,,2/18/1990,35,BOWLER,RHB,LEFT ARM Slow Unorthodox,2,51,70,5,"RCB,RR",,,Capped,200
192,27,SP3,Jeffery,Vandersay,Sri Lanka,,2/5/1990,35,BOWLER,RHB,RIGHT ARM Leg Spin,1,25,14,,,,,Capped,75
193,28,UBA3,Sachin,Baby,India,KCA,12/18/1988,36,BATTER,LHB,RIGHT ARM Off Spin,,,,19,"RR,SRH,RCB",,,Uncapped,30
194,28,UBA3,Priyam,Garg,India,UPCA,11/30/2000,24,BATTER,RHB,,,,,23,"SRH,DC",,,Uncapped,30
195,28,UBA3,Harnoor,Pannu,India,PCA,1/30/2003,22,BATTER,LHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
196,28,UBA3,Smaran,Ravichandran,India,KSCA,5/5/2003,21,BATTER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
197,28,UBA3,Shashwat,Rawat,India,BCA,4/6/2001,24,BATTER,RHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
198,28,UBA3,Andre,Siddarth,India,TNCA,8/28/2006,18,BATTER,RHB,,,,,,,,,Uncapped,30
199,28,UBA3,Avneesh,Sudha,India,CAU,11/20/2001,23,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
200,28,UBA3,Apoorv,Wankhade,India,VCA,3/14/1992,33,BATTER,RHB,,,,,0,KKR,,,Uncapped,30
201,29,UAL3,Yudhvir,Charak,India,JKCA,9/13/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,5,"MI,LSG",LSG,2,Uncapped,30
202,29,UAL3,Rishi,Dhawan,India,HPCA,2/19/1990,35,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,39,"MI,KKR,PBKS",PBKS,1,Uncapped,30
203,29,UAL3,Rajvardhan,Hangargekar,India,MACA,11/10/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,2,CSK,CSK,0,Uncapped,30
204,29,UAL3,Tanush,Kotian,India,MCA,10/16/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,1,RR,RR,1,Uncapped,30
205,29,UAL3,Arshin,Kulkarni,India,MACA,2/15/2005,20,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,2,LSG,LSG,2,Uncapped,30
206,29,UAL3,Shams,Mulani,India,MCA,3/13/1997,28,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,2,MI,MI,2,Uncapped,30
207,29,UAL3,Shivam,Singh,India,TNCA,11/25/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,1,PBKS,PBKS,1,Uncapped,30
208,29,UAL3,Lalit,Yadav,India,DDCA,1/3/1997,28,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,27,DC,DC,2,Uncapped,30
209,30,UWK3,Mohammed,Azharuddeen,India,KCA,3/22/1994,31,WICKETKEEPER,RHB,,,,,0,RCB,,,Uncapped,30
210,30,UWK3,L.R,Chethan,India,KSCA,5/25/2000,24,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
211,30,UWK3,Aryaman Singh,Dhaliwal,India,PCA,4/30/2002,22,WICKETKEEPER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
212,30,UWK3,Urvil,Patel,India,GUCA,10/17/1998,26,WICKETKEEPER,RHB,,,,,0,GT,,,Uncapped,30
213,30,UWK3,Sanskar,Rawat,India,CAU,6/14/2005,19,WICKETKEEPER,LHB,,,,,,,,,Uncapped,30
214,30,UWK3,Bipin,Saurabh,India,BICA,11/20/1999,25,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
215,30,UWK3,Tanay,Thyagarajann,India,HYCA,11/15/1995,29,WICKETKEEPER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
216,31,UFA3,Money,Grewal,India,DDCA,10/4/2000,24,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
217,31,UFA3,Ashwani,Kumar,India,PCA,8/29/2001,23,BOWLER,LHB,LEFT ARM Fast,,,,,,,,Uncapped,30
218,31,UFA3,Ishan,Porel,India,CAB,9/5/1998,26,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
219,31,UFA3,Abhilash,Shetty,India,KSCA,6/6/1998,26,BOWLER,LHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
220,31,UFA3,Akash,Singh,India,BCA,4/26/2002,22,BOWLER,RHB,LEFT ARM Fast,,,,,,,,Uncapped,30
221,31,UFA3,Gurjapneet,Singh,India,TNCA,11/8/1998,26,BOWLER,RHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
222,31,UFA3,Basil,Thampi,India,KCA,9/11/1993,31,BOWLER,RHB,RIGHT ARM Fast,,,,25,"GL,SRH,MI",,,Uncapped,30
223,32,USP3,Murugan,Ashwin,India,JKCA,9/8/1990,34,BOWLER,RHB,RIGHT ARM Leg Spin,,,,44,"RPS,DC,RCB,PBKS,MI,RR",,,Uncapped,30
224,32,USP3,Shreyas,Chavan,India,MACA,9/1/2003,21,BOWLER,LHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
225,32,USP3,Chintal,Gandhi,India,BCA,8/25/1994,30,BOWLER,LHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
226,32,USP3,Raghav,Goyal,India,HCA,6/20/2001,23,BOWLER,LHB,LEFT ARM Slow Unorthodox,,,,1,MI,,,Uncapped,30
227,32,USP3,Jagadeesha,Suchith,India,NCA,1/16/1994,31,BOWLER,LHB,LEFT ARM Slow Orthodox,,,,22,"MI,DC,PBKS,SRH",,,Uncapped,30
228,32,USP3,Roshan,Waghsare,India,MACA,9/7/2003,21,BOWLER,RHB,LEFT ARM Slow Unorthodox,,,,,,,,Uncapped,30
229,32,USP3,Bailapudi,Yeswanth,India,ACA,3/19/2005,20,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
230,33,BA4,Sediqullah,Atal,Afghanistan,,8/12/2001,23,BATTER,LHB,,,,6,,,,,Capped,75
231,33,BA4,Matthew,Breetzke,South Africa,,11/3/1998,26,BATTER,RHB,,,,8,,,,,Capped,75
232,33,BA4,Mark,Chapman,New Zealand,,6/27/1994,30,BATTER,LHB,LEFT ARM Slow Orthodox,,23,76,,,,,Capped,150
233,33,BA4,Brandon,King,West Indies,,12/16/1994,30,BATTER,RHB,RIGHT ARM Off Spin,,37,58,,,,,Capped,75
234,33,BA4,Evin,Lewis,West Indies,,12/27/1991,33,BATTER,LHB,,,59,56,27,"MI,RR,LSG",,,Capped,200
235,33,BA4,Pathum,Nissanka,Sri Lanka,,5/18/1998,26,BATTER,RHB,RIGHT ARM Off Spin,13,58,57,,,,,Capped,75
236,33,BA4,Bhanuka,Rajapaksa,Sri Lanka,,10/24/1991,33,BATTER,LHB,,,5,40,13,PBKS,,,Capped,75
237,33,BA4,Steve,Smith,Australia,,6/2/1989,35,BATTER,RHB,,109,163,67,103,"PWI,RPS,RR,DC",,,Capped,200
238,34,AL4,Gus,Atkinson,England,,1/19/1998,27,ALL-ROUNDER,RHB,RIGHT ARM Fast,8,9,3,0,KKR,KKR,0,Capped,200
239,34,AL4,Tom,Curran,England,,3/12/1995,30,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,2,28,30,13,"KKR,RR,DC,RCB",RCB,0,Capped,200
240,34,AL4,Krishnappa,Gowtham,India,KSCA,10/20/1988,36,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,1,,36,"MI,RR,PBKS,CSK,LSG",LSG,1,Capped,100
241,34,AL4,Mohammad,Nabi,Afghanistan,,1/1/1985,40,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,3,164,129,24,"SRH,MI,KKR",MI,2,Capped,150
242,34,AL4,Gulbadin,Naib,Afghanistan,,6/4/1991,33,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,83,73,2,DC,DC,2,Capped,100
243,34,AL4,Sikandar,Raza,Zimbabwe,,4/24/1986,38,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,17,142,96,9,PBKS,PBKS,2,Capped,125
244,34,AL4,Mitchell,Santner,New Zealand,,2/5/1992,33,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,29,104,104,18,CSK,CSK,3,Capped,200
245,34,AL4,Jayant,Yadav,India,HCA,1/22/1990,35,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,6,2,,20,"DC,MI,GT",GT,0,Capped,75
246,35,WK4,Johnson,Charles,West Indies,,1/14/1989,36,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,58,57,,,,,Capped,75
247,35,WK4,Litton,Das,Bangladesh,,10/13/1994,30,WICKETKEEPER,RHB,RIGHT ARM Off Spin,46,91,92,1,KKR,,,Capped,75
248,35,WK4,Andre,Fletcher,West Indies,,11/28/1987,37,WICKETKEEPER,RHB,RIGHT ARM Leg Spin,,25,58,,,,,Capped,75
249,35,WK4,Tom,Latham,New Zealand,,4/2/1992,33,WICKETKEEPER,LHB,,84,147,26,,,,,Capped,150
250,35,WK4,Ollie,Pope,England,,1/2/1998,27,WICKETKEEPER,RHB,,52,,,,,,,Capped,75
251,35,WK4,Kyle,Verreynne,South Africa,,5/12/1997,27,WICKETKEEPER,RHB,,20,17,,,,,,Capped,75
252,36,FA4,Fazalhaq,Farooqi,Afghanistan,,9/22/2000,24,BOWLER,RHB,LEFT ARM Fast Medium,,34,42,7,SRH,SRH,0,Capped,200
253,36,FA4,Richard,Gleeson,England,,12/2/1987,37,BOWLER,RHB,RIGHT ARM Fast,,,6,2,CSK,CSK,2,Capped,75
254,36,FA4,Matt,Henry,New Zealand,,12/14/1991,33,BOWLER,RHB,RIGHT ARM Fast Medium,26,82,18,6,"PBKS,LSG",LSG,4,Capped,200
255,36,FA4,Alzarri,Joseph,West Indies,,11/20/1996,28,BOWLER,RHB,RIGHT ARM Fast,35,72,32,22,"MI,GT,RCB",RCB,3,Capped,200
256,36,FA4,Kwena,Maphaka,South Africa,,4/8/2006,18,BOWLER,LHB,LEFT ARM Fast,,,3,2,MI,MI,2,Capped,75
257,36,FA4,Kuldeep,Sen,India,MPCA,10/22/1996,28,BOWLER,RHB,RIGHT ARM Fast,,1,,12,RR,RR,3,Capped,75
258,36,FA4,Reece,Topley,England,,2/21/1994,31,BOWLER,RHB,LEFT ARM Fast,,29,34,5,RCB,RCB,4,Capped,75
259,36,FA4,Lizaad,Williams,South Africa,,10/1/1993,31,BOWLER,LHB,RIGHT ARM Fast,2,7,15,2,DC,DC,2,Capped,75
260,36,FA4,Luke,Wood,England,,8/2/1995,29,BOWLER,LHB,LEFT ARM Fast,,2,5,2,MI,MI,2,Capped,75
261,37,UBA4,Sachin,Dhas,India,MACA,2/3/2005,20,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
262,37,UBA4,Leus,Du Plooy,England,,1/12/1995,30,BATTER,LHB,,,,,,,,,Uncapped,50
263,37,UBA4,Ashwin,Hebbar,India,ACA,11/15/1995,29,BATTER,RHB,RIGHT ARM Medium,,,,0,DC,,,Uncapped,30
264,37,UBA4,Rohan,Kunnummal,India,KCA,5/10/1998,26,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
265,37,UBA4,Ayush,Pandey,India,CSCSCA,9/19/2003,21,BATTER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
266,37,UBA4,Akshat,Raghuwanshi,India,MPCA,9/15/2003,21,BATTER,RHB,,,,,,,,,Uncapped,30
267,37,UBA4,Shoun,Roger,India,KCA,10/16/2002,22,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,40
268,37,UBA4,Virat,Singh,India,JSCA,12/8/1997,27,BATTER,LHB,RIGHT ARM Off Spin,,,,3,SRH,,,Uncapped,30
269,38,UAL4,Priyansh,Arya,India,DDCA,9/18/2001,23,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
270,38,UAL4,Manoj,Bhandage,India,KSCA,10/5/1998,26,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,,,,0,RCB,RCB,0,Uncapped,30
271,38,UAL4,Pravin,Dubey,India,KSCA,7/1/1993,31,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,4,DC,DC,0,Uncapped,30
272,38,UAL4,Ajay,Mandal,India,CSCSCA,2/25/1996,29,ALL-ROUNDER,LHB,LEFT ARM Slow Unorthodox,,,,0,CSK,CSK,0,Uncapped,30
273,38,UAL4,Prerak,Mankad,India,SCA,4/23/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,,5,"PBKS,LSG",LSG,0,Uncapped,30
274,38,UAL4,Vipraj,Nigam,India,UPCA,7/28/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
275,38,UAL4,Vicky,Ostwal,India,MACA,9/1/2002,22,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,0,DC,DC,0,Uncapped,30
276,38,UAL4,Shivalik,Sharma,India,BCA,11/28/1998,26,ALL-ROUNDER,LHB,RIGHT ARM Leg Spin,,,,0,MI,MI,0,Uncapped,30
277,39,UWK4,Salil,Arora,India,PCA,11/7/2002,22,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
278,39,UWK4,Dinesh,Bana,India,HCA,9/15/2004,20,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
279,39,UWK4,Ajitesh,Guruswamy,India,TNCA,9/26/2002,22,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
280,39,UWK4,Narayan,Jagadeesan,India,TNCA,12/24/1995,29,WICKETKEEPER,RHB,,,,,13,"CSK,KKR",,,Uncapped,30
281,39,UWK4,Shrijith,Krishnan,India,KSCA,8/12/1996,28,WICKETKEEPER,LHB,,,,,,,,,Uncapped,30
282,39,UWK4,Michael,Pepper,England,,6/25/1998,26,WICKETKEEPER,RHB,,,,,,,,,Uncapped,50
283,39,UWK4,Vishnu,Solanki,India,BCA,10/15/1992,32,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
284,40,UFA4,K.M,Asif,India,KCA,7/24/1993,31,BOWLER,RHB,RIGHT ARM Fast,,,,7,"CSK,RR",,,Uncapped,30
285,40,UFA4,Akhil,Chaudhary,India,DDCA,7/15/2002,22,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
286,40,UFA4,Himanshu,Chauhan,India,DDCA,1/18/2003,22,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
287,40,UFA4,Arpit,Guleria,India,HPCA,4/26/1997,27,BOWLER,RHB,RIGHT ARM Fast,,,,0,LSG,,,Uncapped,30
288,40,UFA4,Nishanth,Saranu,India,HYCA,3/3/2005,20,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
289,40,UFA4,Kuldip,Yadav,India,DDCA,10/15/1996,28,BOWLER,LHB,LEFT ARM Fast,,,,3,RR,,,Uncapped,30
290,40,UFA4,Prithviraj,Yarra,India,ACA,2/20/1998,27,BOWLER,LHB,LEFT ARM Fast,,,,2,"KKR,SRH",,,Uncapped,30
291,41,USP4,Shubham,Agrawal,India,CSCSCA,11/21/1993,31,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
292,41,USP4,Jass Inder,Baidwan,India,PCA,12/14/1996,28,BOWLER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
293,41,USP4,Jasmer,Dhankhar,India,UPCA,10/16/1998,26,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
294,41,USP4,Pulkit,Narang,India,SSCB,6/18/1994,30,BOWLER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
295,41,USP4,Saumy,Pandey,India,MPCA,11/4/2004,20,BOWLER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
296,41,USP4,Mohit,Rathee,India,SSCB,1/13/1999,26,BOWLER,RHB,RIGHT ARM Leg Spin,,,,1,PBKS,,,Uncapped,30
297,41,USP4,Himanshu,Singh,India,MCA,7/24/2003,21,BOWLER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
298,42,BA5,Towhid,Hridoy,Bangladesh,,12/4/2000,24,BATTER,RHB,RIGHT ARM Off Spin,,30,32,,,,,Capped,75
299,42,BA5,Mikyle,Louis,West Indies,,8/19/2000,24,BATTER,RHB,,5,,,,,,,Capped,75
300,42,BA5,Harry,Tector,Ireland,,12/6/1999,25,BATTER,RHB,RIGHT ARM Off Spin,6,46,81,,,,,Capped,75
301,42,BA5,Rassie,Van Der Dussen,South Africa,,2/7/1989,36,BATTER,RHB,RIGHT ARM Off Spin,15,65,48,3,RR,,,Capped,200
302,42,BA5,Will,Young,New Zealand,,11/22/1992,32,BATTER,RHB,,19,31,20,,,,,Capped,125
303,42,BA5,Najibullah,Zadran,Afghanistan,,2/28/1993,32,BATTER,LHB,,,92,107,,,,,Capped,75
304,42,BA5,Ibrahim,Zadran,Afghanistan,,1/12/2001,24,BATTER,RHB,RIGHT ARM Medium,7,33,44,,,,,Capped,75
305,43,AL5,Sean,Abbott,Australia,,2/29/1992,33,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,24,20,3,"RCB,SRH",,,Capped,200
306,43,AL5,Jacob,Bethell,England,,,,10/23/2003,21,ALL-ROUNDER,LHB       LEFT ARM Slow Orthodox,,,6,2,,,,,Capped,125
307,43,AL5,Brydon,Carse,England,,7/31/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Fast,2,19,4,,,,,Capped,100
308,43,AL5,Aaron,Hardie,Australia,,1/7/1999,26,ALL-ROUNDER,RHB,RIGHT ARM Medium,,8,10,,,,,Capped,125
309,43,AL5,Sarfaraz,Khan,India,MCA,10/22/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,5,,,50,"RCB,PBKS,DC",,,Capped,75
310,43,AL5,Kyle,Mayers,West Indies,,9/8/1992,32,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,18,28,38,12,LSG,LSG,0,Capped,150
311,43,AL5,Kamindu,Mendis,Sri Lanka,,9/30/1998,26,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,8,10,19,,,,,Capped,75
312,43,AL5,Matthew,Short,Australia,,11/8/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,8,11,6,PBKS,,,Capped,75
313,44,FA5,Jason,Behrendorff,Australia,,4/20/1990,34,BOWLER,RHB,LEFT ARM Fast,,12,17,17,"CSK,RCB,MI",MI,0,Capped,150
314,44,FA5,Dushmantha,Chameera,Sri Lanka,,1/11/1992,33,BOWLER,RHB,RIGHT ARM Fast,12,52,55,13,"RR,RCB,LSG,KKR",LSG,1,Capped,75
315,44,FA5,Nathan,Ellis,Australia,,9/22/1994,30,BOWLER,RHB,RIGHT ARM Fast Medium,,8,17,16,PBKS,PBKS,1,Capped,125
316,44,FA5,Shamar,Joseph,West Indies,,8/31/1999,25,BOWLER,LHB,RIGHT ARM Fast,6,,8,1,LSG,LSG,1,Capped,75
317,44,FA5,Josh,Little,Ireland,,11/1/1999,25,BOWLER,RHB,LEFT ARM Fast Medium,,36,69,11,GT,GT,1,Capped,75
318,44,FA5,Shivam,Mavi,India,UPCA,11/26/1998,26,BOWLER,RHB,RIGHT ARM Fast Medium,,,6,32,"KKR,GT,LSG",GT,0,Capped,75
319,44,FA5,Jhye,Richardson,Australia,,9/20/1996,28,BOWLER,RHB,RIGHT ARM Fast,3,15,18,4,"PBKS,MI,DC",DC,1,Capped,150
320,44,FA5,Navdeep,Saini,India,DDCA,11/23/1992,32,BOWLER,RHB,RIGHT ARM Fast,2,8,11,32,"DC,RCB,RR",RR,0,Capped,75
321,45,UBA5,Tanmay,Agarwal,India,HYCA,5/3/1995,29,BATTER,RHB,RIGHT ARM Leg Spin,,,,0,SRH,,,Uncapped,30
322,45,UBA5,Amandeep,Khare,India,CSCSCA,8/5/1997,27,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
323,45,UBA5,Ayush,Mhatre,India,MCA,7/16/2007,17,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
324,45,UBA5,Salman,Nizar,India,KCA,6/30/1997,27,BATTER,LHB,,,,,,,,,Uncapped,30
325,45,UBA5,Aniket,Verma,India,MPCA,2/5/2002,23,BATTER,RHB,,,,,,,,,Uncapped,30
326,45,UBA5,Sumeet,Verma,India,HPCA,11/18/1990,34,BATTER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
327,45,UBA5,Manan,Vohra,India,UTCA,7/18/1993,31,BATTER,RHB,,,,,56,"PBKS,RCB,RR,LSG",,,Uncapped,30
328,45,UBA5,Samarth,Vyas,India,SCA,11/28/1995,29,BATTER,RHB,RIGHT ARM Leg Spin,,,,0,SRH,,,Uncapped,30
329,46,UAL5,Raj Angad,Bawa,India,UTCA,11/12/2002,22,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,,,,2,PBKS,,,Uncapped,30
330,46,UAL5,Emanjot,Chahal,India,PCA,8/17/2004,20,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
331,46,UAL5,Musheer,Khan,India,MCA,2/27/2005,20,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
332,46,UAL5,Manvanth,Kumar L,India,KSCA,1/11/2004,21,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
333,46,UAL5,Mayank,Rawat,India,DDCA,12/4/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
334,46,UAL5,Suryansh,Shedge,India,MCA,1/29/2003,22,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
335,46,UAL5,Hritik,Shokeen,India,DDCA,8/14/2000,24,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,13,MI,,,Uncapped,30
336,46,UAL5,Sonu,Yadav,India,TNCA,11/11/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,0,RCB,,,Uncapped,30
337,47,UWK5,S. Rithik,Easwaran,India,TNCA,2/15/2002,23,WICKETKEEPER,LHB,,,,,,,,,Uncapped,30
338,47,UWK5,Anmol,Malhotra,India,PCA,11/29/1995,29,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
339,47,UWK5,Pradosh,Paul,India,TNCA,12/21/2000,24,WICKETKEEPER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
340,47,UWK5,Karteek,Sharma,India,PCA,10/25/2001,23,WICKETKEEPER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
341,47,UWK5,Akash,Singh,India,ARCA,12/20/1995,29,WICKETKEEPER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
342,47,UWK5,Tejasvi,Singh,India,DDCA,4/18/2002,22,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
343,47,UWK5,Siddharth,Yadav,India,UPCA,8/13/2003,21,WICKETKEEPER,LHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
344,48,UFA5,Saurabh,Dubey,India,VCA,1/23/1998,27,BOWLER,RHB,LEFT ARM Fast Medium,,,,0,SRH,,,Uncapped,30
345,48,UFA5,Aaqib,Khan,India,UPCA,12/25/2003,21,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
346,48,UFA5,Kulwant,Khejroliya,India,MPCA,3/13/1992,33,BOWLER,LHB,LEFT ARM Fast Medium,,,,7,"MI,RCB,KKR",,,Uncapped,30
347,48,UFA5,Ankit Singh,Rajpoot,India,UPCA,12/4/1993,31,BOWLER,RHB,RIGHT ARM Fast Medium,,,,29,"CSK,KKR,PBKS,RR,LSG",,,Uncapped,30
348,48,UFA5,Divesh,Sharma,India,HPCA,4/20/2001,23,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
349,48,UFA5,Naman,Tiwari,India,UPCA,11/8/2005,19,BOWLER,LHB,LEFT ARM Fast,,,,,,,,Uncapped,30
350,48,UFA5,Prince,Yadav,India,DDCA,12/12/2001,23,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
351,49,USP5,Kunal Singh,Chibb,India,JKCA,3/31/1997,28,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
352,49,USP5,Yuvraj,Chudasama,India,SCA,11/23/1995,29,BOWLER,LHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
353,49,USP5,Deepak,Devadiga,India,KSCA,4/14/1999,25,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
354,49,USP5,Ramesh,Prasad,India,CAB,1/30/1994,31,BOWLER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
355,49,USP5,Shivam,Shukla,India,MPCA,12/11/1995,29,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
356,49,USP5,Himanshu,Singh,India,BICA,9/23/1997,27,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
357,49,USP5,Tejpreet,Singh,India,PCA,8/11/2000,24,BOWLER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
358,50,AL6,Qais,Ahmad,Afghanistan,,8/15/2000,24,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,2,3,11,,,,,Capped,75
359,50,AL6,Charith,Asalanka,Sri Lanka,,6/29/1997,27,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,3,63,53,,,,,Capped,75
360,50,AL6,Michael,Bracewell,New Zealand,,2/14/1991,34,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,5,19,22,5,RCB,,,Capped,150
361,50,AL6,Gudakesh,Motie,West Indies,,3/29/1995,30,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,9,14,21,,,,,Capped,75
362,50,AL6,Daniel,Mousley,England,,7/8/2001,23,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,1,,,,,,Capped,75
363,50,AL6,Jamie,Overton,England,,4/10/1984,41,ALL-ROUNDER,RHB,RIGHT ARM Fast,1,1,2,,,,,Capped,150
364,50,AL6,Dunith,Wellalage,Sri Lanka,,1/9/2003,22,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,1,25,2,,,,,Capped,75
365,51,FA6,Ottneil,Baartman,South Africa,,3/18/1993,32,BOWLER,RHB,RIGHT ARM Fast Medium,,3,10,,,,,Capped,75
366,51,FA6,Xavier,Bartlett,Australia,,12/17/1998,26,BOWLER,RHB,RIGHT ARM Fast Medium,,2,4,,,,,Capped,75
367,51,FA6,Dilshan,Madushanka,Sri Lanka,,9/18/2000,24,BOWLER,RHB,LEFT ARM Fast,1,23,15,0,MI,MI,0,Capped,75
368,51,FA6,Adam,Milne,New Zealand,,4/13/1992,32,BOWLER,RHB,RIGHT ARM Fast,,49,53,10,"RCB,MI,CSK",,,Capped,200
369,51,FA6,Lungisani,Ngidi,South Africa,,3/29/1996,29,BOWLER,RHB,RIGHT ARM Fast Medium,19,62,43,14,"CSK,DC",DC,0,Capped,100
370,51,FA6,William,O'Rourke,New Zealand,,8/6/2001,23,BOWLER,RHB,RIGHT ARM Fast,6,3,3,,,,,Capped,150
371,51,FA6,Chetan,Sakariya,India,SCA,2/28/1998,27,BOWLER,LHB,LEFT ARM Medium,,1,2,19,"RR,DC,KKR",KKR,0,Capped,75
372,51,FA6,Sandeep,Warrier,India,TNCA,4/4/1991,34,BOWLER,RHB,RIGHT ARM Fast Medium,,,1,10,"KKR,GT",,,Capped,75
373,52,UBA6,Musaif,Ajaz,India,JKCA,8/3/2002,22,BATTER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
374,52,UBA6,Agni,Chopra,India,CAM,11/4/1998,26,BATTER,LHB,,,,,,,,,Uncapped,30
375,52,UBA6,Abhimanyu,Easwaran,India,CAB,9/6/1995,29,BATTER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
376,52,UBA6,Sudip,Gharami,India,CAB,3/21/1999,26,BATTER,RHB,,,,,,,,,Uncapped,30
377,52,UBA6,Shubham,Khajuria,India,JKCA,9/13/1995,29,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
378,52,UBA6,Akhil,Rawat,India,CAU,11/4/2000,24,BATTER,RHB,,,,,,,,,Uncapped,30
379,52,UBA6,Prateek,Yadav,India,CSCSCA,2/16/1999,26,BATTER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
380,53,UAL6,Abdul,Bazith,India,KCA,10/9/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,1,RR,,,Uncapped,30
381,53,UAL6,K.C,Cariappa,India,CAM,4/13/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,11,"PBKS,KKR,RR",,,Uncapped,30
382,53,UAL6,Yuvraj,Chaudhary,India,CAU,10/6/2001,23,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
383,53,UAL6,Aman,Khan,India,CAP,11/23/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,12,"KKR,DC",,,Uncapped,30
384,53,UAL6,Sumit,Kumar,India,HCA,12/12/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
385,53,UAL6,Kamlesh,Nagarkoti,India,RCA,12/28/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,12,"KKR,DC",,,Uncapped,30
386,53,UAL6,Hardik,Raj,India,KSCA,3/10/2006,19,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
387,53,UAL6,Harsh,Tyagi,India,DDCA,12/23/1999,25,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
388,54,UWK6,M.,Ajnas,India,KCA,5/8/1997,27,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
389,54,UWK6,Unmukt,Chand,USA,,3/26/1993,32,WICKETKEEPER,RHB,,,,,21,"DC,RR,MI",,,Associate,30
390,54,UWK6,Tejasvi,Dahiya,India,DDCA,4/18/2002,22,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
391,54,UWK6,Sumit,Ghadigaonkar,India,ASCA,4/11/1992,32,WICKETKEEPER,RHB,,,,,,,,,Uncapped,30
392,54,UWK6,Baba,Indrajith,India,TNCA,7/8/1994,30,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,3,KKR,,,Uncapped,30
393,54,UWK6,Muhammed,Khan,India,TNCA,12/30/2000,24,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
394,54,UWK6,Bhagmender,Lather,India,UTCA,6/18/1997,27,WICKETKEEPER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
395,55,UFA6,Baltej,Dhanda,India,PCA,11/4/1990,34,BOWLER,RHB,RIGHT ARM Fast Medium,,,,0,PBKS,,,Uncapped,30
396,55,UFA6,Ali,Khan,USA,,12/13/1990,34,BOWLER,RHB,RIGHT ARM Fast,,,,0,KKR,,,Associate,30
397,55,UFA6,Ravi,Kumar,India,CAB,10/29/2003,21,BOWLER,LHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
398,55,UFA6,Vineet,Panwar,India,UPCA,6/28/1998,26,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
399,55,UFA6,Vidyadhar,Patil,India,KSCA,9/5/2000,24,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
400,55,UFA6,Aradhya,Shukla,India,PCA,12/6/2004,20,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
401,55,UFA6,Abhinandan,Singh,India,UPCA,3/30/1997,28,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
402,56,AL7,Cooper,Connolly,Australia,,8/22/2003,21,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,1,2,,,,,Capped,75
403,56,AL7,Dushan,Hemantha,Sri Lanka,,5/24/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,5,,,,,,Capped,75
404,56,AL7,Jason,Holder,West Indies,,11/5/1991,33,ALL-ROUNDER,RHB,RIGHT ARM Fast,69,138,63,46,"CSK,KKR,SRH,LSG,RR",,,Capped,200
405,56,AL7,Karim,Janat,Afghanistan,,8/11/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,2,3,66,,,,,Capped,75
406,56,AL7,Jimmy,Neesham,New Zealand,,9/17/1990,34,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,12,76,79,14,"DC,PBKS,MI,RR",,,Capped,150
407,56,AL7,Daniel,Sams,Australia,,10/27/1992,32,ALL-ROUNDER,RHB,LEFT ARM Fast,,,10,16,"DC,RCB,MI,LSG",,,Capped,150
408,56,AL7,William,Sutherland,Australia,,10/27/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Fast,,2,,,,,,Capped,75
409,57,FA7,Taskin,Ahmed,Bangladesh,,4/3/1995,30,BOWLER,LHB,RIGHT ARM Fast,15,73,70,,,,,Capped,100
410,57,FA7,Ben,Dwarshuis,Australia,,6/23/1994,30,BOWLER,LHB,LEFT ARM Fast,,1,3,0,"PBKS,DC",,,Capped,75
411,57,FA7,Obed,McCoy,West Indies,,1/4/1997,28,BOWLER,RHB,LEFT ARM Fast,,2,38,8,RR,,,Capped,125
412,57,FA7,Riley,Meredith,Australia,,6/21/1996,28,BOWLER,RHB,RIGHT ARM Fast,,1,6,,,,,Capped,150
413,57,FA7,Lance,Morris,Australia,,3/28/1998,27,BOWLER,RHB,RIGHT ARM Fast,,2,22,,,,,Capped,125
414,57,FA7,Olly,Stone,England,,10/9/1993,31,BOWLER,RHB,RIGHT ARM Fast,5,10,1,,,,,Capped,75
415,57,FA7,Daniel,Worrall,England,,7/10/1991,33,BOWLER,RHB,RIGHT ARM Fast Medium,,3,,,,,,Capped,150
416,58,UBA7,Pyla,Avinash,India,ACA,7/7/2000,24,BATTER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
417,58,UBA7,Kiran,Chormale,India,MACA,10/11/2005,19,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
418,58,UBA7,Ashish,Dahariya,India,CSCSCA,10/17/2004,20,BATTER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
419,58,UBA7,Tushar,Raheja,India,TNCA,2/7/2001,24,BATTER,LHB,,,,,,,,,Uncapped,30
420,58,UBA7,Sarthak,Ranjan,India,DDCA,9/25/1996,28,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
421,58,UBA7,Abhijeet,Tomar,India,RCA,3/14/1995,30,BATTER,RHB,RIGHT ARM Off Spin,,,,1,KKR,,,Uncapped,30
422,59,UAL7,Krish,Bhagat,India,PCA,11/6/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
423,59,UAL7,Sohraab,Dhaliwal,India,PCA,11/18/1991,33,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
424,59,UAL7,Harsh,Dubey,India,VCA,7/23/2002,22,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
425,59,UAL7,Ramakrishna,Ghosh,India,MACA,8/28/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
426,59,UAL7,Raj,Limbani,India,BCA,2/2/2005,20,ALL-ROUNDER,LHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
427,59,UAL7,Ninad,Rathva,India,BCA,3/10/1999,26,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
428,59,UAL7,Vivrant,Sharma,India,JKCA,10/30/1999,25,ALL-ROUNDER,LHB,RIGHT ARM Leg Spin,,,,2,SRH,,,Uncapped,30
429,59,UAL7,Shiva,Singh,India,UPCA,10/16/1999,25,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
430,60,UFA7,Sayed Irfan,Aftab,India,CAB,11/20/2003,21,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
431,60,UFA7,Anirudh,Chowdhary,India,DDCA,11/8/1999,25,BOWLER,LHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
432,60,UFA7,Anshuman,Hooda,India,DDCA,1/4/2001,24,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
433,60,UFA7,Siddharth,Kaul,India,PCA,5/19/1990,34,BOWLER,RHB,RIGHT ARM Fast Medium,,,,55,"KKR,DC,SRH,RCB",,,Uncapped,40
434,60,UFA7,Prashant Sai,Painkra,India,CSCSCA,9/8/2002,22,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
435,60,UFA7,Venkata Satyanarayana,Penmetsa,India,ACA,7/10/1999,25,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
436,60,UFA7,Yeddala,Reddy,India,ACA,12/13/1999,25,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
437,61,AL8,Zak,Foulkes,New Zealand,,6/5/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,2,,,,,Capped,75
438,61,AL8,Chris,Green,Australia,,10/1/1993,31,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,1,1,KKR,,,Capped,100
439,61,AL8,Shakib Al,Hasan,Bangladesh,,3/24/1987,38,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,71,247,129,71,"SRH,KKR",,,Capped,100
440,61,AL8,Mehidy Hasan,Miraz,Bangladesh,,10/25/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,49,97,27,,,,,Capped,100
441,61,AL8,Wiaan,Mulder,South Africa,,2/19/1998,27,ALL-ROUNDER,RHB,RIGHT ARM Medium,15,20,11,,,,,Capped,75
442,61,AL8,Dwaine,Pretorius,South Africa,,3/29/1989,36,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,3,27,30,7,CSK,,,Capped,75
443,61,AL8,Dasun,Shanaka,Sri Lanka,,9/9/1991,33,ALL-ROUNDER,RHB,RIGHT ARM Fast,6,71,102,3,GT,,,Capped,75
444,62,FA8,Shoriful,Islam,Bangladesh,,6/3/2001,23,BOWLER,LHB,LEFT ARM Fast Medium,11,36,42,,,,,Capped,75
445,62,FA8,Blessing,Muzarabani,Zimbabwe,,10/2/1996,28,BOWLER,RHB,RIGHT ARM Fast,7,48,61,,,,,Capped,75
446,62,FA8,Matthew,Potts,England,,10/29/1998,26,BOWLER,RHB,RIGHT ARM Fast Medium,9,9,,,,,,Capped,150
447,62,FA8,Tanzim Hasan,Sakib,Bangladesh,,10/20/2002,22,BOWLER,RHB,RIGHT ARM Fast,,7,15,,,,,Capped,75
448,62,FA8,Benjamin,Sears,New Zealand,,2/11/1998,27,BOWLER,RHB,RIGHT ARM Fast,1,,17,,,,,Capped,100
449,62,FA8,Tim,Southee,New Zealand,,12/11/1988,36,BOWLER,RHB,RIGHT ARM Fast Medium,104,161,126,54,"CSK,RR,MI,RCB,KKR",,,Capped,150
450,62,FA8,John,Turner,England,,4/10/2001,23,BOWLER,RHB,RIGHT ARM Fast,,1,,,,,,Capped,150
451,63,UBA8,Joshua,Brown,Australia,,12/26/1993,31,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
452,63,UBA8,Oliver,Davies,Australia,,10/14/2000,24,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
453,63,UBA8,Bevan John,Jacobs,New Zealand,,5/6/2002,22,BATTER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
454,63,UBA8,Atharva,Kale,India,MACA,9/21/1999,25,BATTER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
455,63,UBA8,Abhishek,Nair,India,KCA,6/6/2004,20,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
456,63,UBA8,Vishwanath Pratap,Singh,India,PCA,6/18/1998,26,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
457,64,UAL8,Nasir,Lone,India,JKCA,9/5/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
458,64,UAL8,Brandon,McMullen,Scotland,,10/18/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,,,,,,Associate,30
459,64,UAL8,S.,Midhun,India,KCA,10/7/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,1,RR,,,Uncapped,30
460,64,UAL8,Abid,Mushtaq,India,JKCA,1/17/1997,28,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
461,64,UAL8,Mahesh,Pithiya,India,BCA,12/24/2001,23,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
462,64,UAL8,Maramreddy,Reddy,India,ACA,10/28/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
463,64,UAL8,Atit,Sheth,India,BCA,2/3/1996,29,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
464,64,UAL8,Jonty,Sidhu,India,DDCA,12/9/1997,27,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
465,65,UFA8,Mohit,Avasthi,India,MCA,11/18/1992,32,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
466,65,UFA8,Faridoon,Dawoodzai,Afghanistan,,11/26/2005,19,BOWLER,LHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
467,65,UFA8,Praful,Hinge,India,VCA,1/18/2002,23,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
468,65,UFA8,Pankaj,Jaswal,India,HPCA,9/20/1995,29,BOWLER,RHB,RIGHT ARM Fast,,,,0,MI,,,Uncapped,30
469,65,UFA8,Vijay,Kumar,India,UPCA,12/24/2005,19,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
470,65,UFA8,Ashok,Sharma,India,RCA,6/17/2002,22,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
471,65,UFA8,Mujtaba,Yousuf,India,JKCA,6/7/2002,22,BOWLER,LHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
472,66,AL9,Ashton,Agar,Australia,,10/14/1993,31,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,5,22,49,,,,,Capped,125
473,66,AL9,Roston,Chase,West Indies,,3/22/1992,33,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,49,49,25,,,,,Capped,75
474,66,AL9,Junior,Dala,South Africa,,12/29/1989,35,ALL-ROUNDER,RHB,RIGHT ARM Fast,,2,10,1,DC,,,Capped,75
475,66,AL9,Mahedi,Hasan,Bangladesh,,12/12/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,11,51,,,,,Capped,75
476,66,AL9,Nangeyalia,Kharote,Afghanistan,,4/25/2004,20,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,4,6,,,,,Capped,75
477,66,AL9,Dan,Lawrence,England,,7/12/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,14,,,,,,,Capped,100
478,66,AL9,Nathan,Smith,New Zealand,,7/15/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast,0,0,0,,,,,Capped,100
479,67,FA9,James,Anderson,England,,7/30/1982,42,BOWLER,LHB,RIGHT ARM Fast,188,194,19,,,,,Capped,125
480,67,FA9,Kyle,Jamieson,New Zealand,,12/30/1994,30,BOWLER,RHB,RIGHT ARM Fast,19,13,13,9,"RCB,CSK",,,Capped,150
481,67,FA9,Chris,Jordan,England,,10/4/1988,36,BOWLER,RHB,RIGHT ARM Fast,8,35,95,34,"RCB,SRH,PBKS,CSK,MI",,,Capped,200
482,67,FA9,Hasan,Mahmud,Bangladesh,,2/12/1997,28,BOWLER,RHB,RIGHT ARM Fast Medium,6,22,18,,,,,Capped,75
483,67,FA9,Tymal,Mills,England,,8/12/1992,32,BOWLER,RHB,LEFT ARM Fast,,,16,10,"RCB,MI",,,Capped,200
484,67,FA9,David,Payne,England,,2/15/1991,34,BOWLER,RHB,LEFT ARM Fast Medium,,1,,,,,,Capped,100
485,67,FA9,Nahid,Rana,Bangladesh,,10/25/2002,22,BOWLER,RHB,RIGHT ARM Fast,5,,,,,,,Capped,75
486,68,UBA9,Prayas Ray,Barman,India,CAB,10/25/2002,22,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
487,68,UBA9,Jafar,Jamal,India,TNCA,3/20/1990,35,BATTER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
488,68,UBA9,Ayaz,Khan,India,MCA,9/10/2002,22,BATTER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
489,68,UBA9,Kaushik,Maity,India,CAB,10/14/1999,25,BATTER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
490,68,UBA9,Rituraj,Sharma,India,UPCA,11/27/2002,22,BATTER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
491,68,UBA9,Vaibhav,Suryavanshi,India,BICA,3/27/2011,14,BATTER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
492,69,UAL9,Kartik,Chadha,India,PCA,1/8/2004,21,ALL-ROUNDER,LHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
493,69,UAL9,Writtick,Chatterjee,India,CAB,9/28/1992,32,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,0,PBKS,,,Uncapped,30
494,69,UAL9,Prerit,Dutta,India,PCA,9/22/1998,26,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
495,69,UAL9,Rajneesh,Gurbani,India,MACA,1/28/1993,32,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
496,69,UAL9,Shubhang,Hegde,India,KSCA,3/30/2001,24,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
497,69,UAL9,Saransh,Jain,India,MPCA,3/31/1993,32,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
498,69,UAL9,Ripal,Patel,India,GUCA,9/28/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,,9,DC,,,Uncapped,30
499,69,UAL9,Akash,Vashisht,India,HPCA,12/17/1994,30,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,0,RR,,,Uncapped,30
500,70,UFA9,Anirudh,Kanwar,India,UTCA,3/13/1994,31,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
501,70,UFA9,Shubham,Kapse,India,VCA,7/22/1994,30,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
502,70,UFA9,Atif,Mushtaq,India,JKCA,3/20/2003,22,BOWLER,LHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
503,70,UFA9,Dipesh,Parwani,India,VCA,1/14/2000,25,BOWLER,LHB,LEFT ARM Fast Medium,,,,,,,,Uncapped,30
504,70,UFA9,Manish,Reddy,India,HYCA,1/7/1999,26,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
505,70,UFA9,Chetan,Sharma,India,RCA,11/23/2005,19,BOWLER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
506,70,UFA9,Avinash,Singh,India,JKCA,7/5/1998,26,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
507,72,AL10,Alick,Athanaze,West Indies,,12/7/1998,26,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,9,11,4,,,,,Capped,75
508,72,AL10,Hilton,Cartwright,Australia,,2/14/1992,33,ALL-ROUNDER,RHB,RIGHT ARM Medium,2,2,,,,,,Capped,75
509,72,AL10,Dominic,Drakes,West Indies,,2/6/1998,27,ALL-ROUNDER,LHB,LEFT ARM Fast,,3,10,0,GT,,,Capped,125
510,72,FA10,Daryn,Dupavillon,South Africa,,7/15/1994,30,BOWLER,RHB,RIGHT ARM Fast,,2,,,,,,Capped,75
511,72,AL10,Matthew,Forde,West Indies,,4/29/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,6,6,,,,,Capped,125
512,72,AL10,Patrick,Kruger,South Africa,,2/3/1995,30,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,6,,,,,Capped,75
513,72,FA10,Lahiru,Kumara,Sri Lanka,,2/13/1997,28,BOWLER,LHB,RIGHT ARM Fast,31,31,26,,,,,Capped,75
514,72,AL10,Michael,Neser,Australia,,3/29/1990,35,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,1,PBKS,,,Capped,75
515,72,FA10,Richard,Ngarava,Zimbabwe,,12/29/1997,27,BOWLER,LHB,LEFT ARM Fast Medium,5,44,60,,,,,Capped,75
516,72,FA10,Wayne,Parnell,South Africa,,7/30/1989,35,BOWLER,LHB,LEFT ARM Fast Medium,6,73,56,33,"PWI,DC,RCB",,,Capped,100
517,72,AL10,Keemo,Paul,West Indies,,2/21/1998,27,ALL-ROUNDER,RHB,RIGHT ARM Fast,3,30,23,8,DC,,,Capped,125
518,72,AL10,Odean,Smith,West Indies,,11/1/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Medium,,9,27,6,"PBKS,GT",,,Capped,75
519,72,FA10,Andrew,Tye,Australia,,12/12/1986,38,BOWLER,RHB,RIGHT ARM Fast Medium,,7,32,30,"GL,PBKS,RR,LSG",,,Capped,75
520,73,UAL10,Ajay,Ahlawat,India,DDCA,5/27/1997,27,ALL-ROUNDER,LHB,LEFT ARM Fast,,,,,,,,Uncapped,40
521,73,UAL10,Corbin,Bosch,South Africa,,9/10/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,0,RR,,,Uncapped,30
522,73,UAL10,Mayank,Gusain,India,DDCA,9/25/2001,23,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
523,73,UAL10,Mukhtar,Hussain,India,ASCA,1/11/1999,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
524,73,UAL10,Girinath,Reddy,India,ACA,10/8/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
525,73,UAL10,Jalaj,Saxena,India,KCA,12/15/1986,38,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,1,"MI,RCB,DC,PBKS",,,Uncapped,40
526,73,UAL10,Yajas,Sharma,India,DDCA,8/21/2005,19,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
527,73,UAL10,Sanjay,Yadav,India,TNCA,5/10/1995,29,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,1,"KKR, SRH,MI",,,Uncapped,30
528,74,UFA10,Vishal,Godara,India,RCA,2/25/2003,22,BOWLER,LHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
529,74,UFA10,Eshan,Malinga,Sri Lanka,,2/4/2001,24,BOWLER,LHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
530,74,UFA10,Samarth,Nagraj,India,KSCA,10/21/2005,19,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
531,74,UFA10,Abhishek,Saini,India,UTCA,12/2/1998,26,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
532,74,UFA10,Dumindu,Sewmina,Sri Lanka,,12/19/2004,20,BOWLER,RHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
533,74,UFA10,Pradyuman Kumar,Singh,India,UTCA,12/3/2001,23,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
534,74,UFA10,Vasu,Vats,India,UPCA,9/8/2002,22,BOWLER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
535,75,UAL11,Umang,Kumar,India,GUCA,12/11/2000,24,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
536,75,UAL11,Mohamed,Ali,India,TNCA,10/3/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
537,75,UAL11,Atharva,Ankolekar,India,MCA,9/26/2000,24,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
538,75,UAL11,Vaisakh,Chandran,India,KCA,5/31/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
539,75,UAL11,Auqib,Dar,India,JKCA,11/4/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
540,75,UAL11,Rohit,Rayudu,India,HYCA,7/29/1994,30,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
541,75,UAL11,Uday,Saharan,India,PCA,9/8/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
542,75,UAL11,Ayush,Vartak,India,MCA,10/29/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
543,76,UAL12,Baba,Aparajith,India,KCA,7/8/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,0,RPS,,,Uncapped,30
544,76,UAL12,Sumit Kumar,Beniwal,India,DDCA,4/11/1999,25,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
545,76,UAL12,Nishunk,Birla,India,UTCA,10/22/2004,20,ALL-ROUNDER,RHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
546,76,UAL12,Digvijay,Deshmukh,India,MACA,4/12/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,0,MI,,,Uncapped,30
547,76,UAL12,Lakshay,Jain,India,TNCA,7/5/2002,22,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
548,76,UAL12,Duan,Jansen,South Africa,,5/1/2000,24,ALL-ROUNDER,RHB,LEFT ARM Fast,,,,,,,,Uncapped,30
549,76,UAL12,Kritagya,Singh,India,UPCA,9/25/2000,24,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
550,76,UAL12,P.,Vignesh,India,TNCA,4/6/2005,20,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
551,77,UAL13,Sabhay,Chadha,India,CAP,5/7/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
552,77,UAL13,Ben,Howell,England,,10/5/1988,36,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,0,PBKS,,,Uncapped,50
553,77,UAL13,Hemanth,Kumar,India,ACA,12/12/2004,20,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
554,77,UAL13,Rohan,Rana,India,HCA,1/12/2002,23,ALL-ROUNDER,RHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
555,77,UAL13,Bharat,Sharma,India,CAP,11/15/1995,29,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
556,77,UAL13,Pratham,Singh,India,RSPB,8/31/1992,32,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,,,,0,"GL,KKR",,,Uncapped,30
557,77,UAL13,Tripurana,Vijay,India,ACA,9/5/2001,23,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
558,77,UAL13,Ravi,Yadav,India,JSCA,12/26/1997,27,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
559,78,UAL14,Arjun,Azad,India,UTCA,8/8/2001,23,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
560,78,UAL14,Abhay,Choudhary,India,PCA,6/26/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
561,78,UAL14,Gaurav,Gambhir,India,UTCA,11/26/1987,37,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
562,78,UAL14,Shubham,Garhwal,India,RCA,5/14/1995,29,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
563,78,UAL14,Tejasvi,Jaiswal,India,TCA,3/2/1997,28,ALL-ROUNDER,LHB,RIGHT ARM Fast,,,,,,,,Uncapped,30
564,78,UAL14,Sairaj,Patil,India,MCA,10/31/1996,28,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
565,78,UAL14,Madhav,Tiwari,India,MPCA,9/28/2003,21,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
566,78,UAL14,Kamal,Tripathi,India,MPCA,8/15/1998,26,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
567,79,UAL15,Prashant,Chauhan,India,CAU,4/1/2001,24,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,,,,,,,,Uncapped,30
568,79,UAL15,Yash,Dabas,India,DDCA,12/8/2004,20,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,,,,,,,,Uncapped,30
569,79,UAL15,Dhruv,Kaushik,India,DDCA,7/11/2000,24,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
570,79,UAL15,Khrievitso,Kense,India,NCA,3/6/2004,21,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,,,,,,,Uncapped,30
571,79,UAL15,Akash,Parkar,India,MCA,5/20/1994,30,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
572,79,UAL15,Vignesh,Puthur,India,KCA,3/2/2001,24,ALL-ROUNDER,RHB,LEFT ARM Slow Unorthodox,,,,,,,,Uncapped,30
573,79,UAL15,Tripuresh,Singh,India,MPCA,4/13/2002,22,ALL-ROUNDER,RHB,RIGHT ARM Medium,,,,,,,,Uncapped,30
574,79,UAL15,Vijay,Yadav,India,UPCA,12/19/2001,23,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,,,,,,,Uncapped,30
575,,R1,Rohit,Sharma,India,MCA,1987-04-30,38.0,BATTER,RHB,RIGHT ARM Off Spin,56,262,148,243,DC,MI,16.0,Capped,200
576,,R1,Sanju,Samson,India,KCA,1994-11-11,30.0,WICKETKEEPER,RHB,RIGHT ARM Leg Spin,0,16,24,138,RR,RR,15.0,Capped,150
577,,R1,Virat,Kohli,India,DDCA,1988-11-05,36.0,BATTER,RHB,RIGHT ARM Medium,113,292,117,252,RCB,RCB,16.0,Capped,200
578,,R1,Suryakumar,Yadav,India,MCA,1990-09-14,34.0,BATTER,RHB,RIGHT ARM Off Spin,10,41,60,139,MI,MI,12.0,Capped,200
579,,R1,Ruturaj,Gaikwad,India,MCA,1997-01-31,28.0,BATTER,RHB,RIGHT ARM Off Spin,0,7,23,61,CSK,CSK,6.0,Capped,150
580,,R1,Sunil,Narine,West Indies,,1988-05-26,37.0,ALL-ROUNDER,LHB,RIGHT ARM Off Spin,6,65,51,162,KKR,KKR,13.0,Capped,150
581,,R1,Travis,Head,Australia,,1993-12-29,31.0,BATTER,LHB,RIGHT ARM Off Spin,23,75,23,12,SRH,SRH,1.0,Capped,150
582,,R1,Jasprit,Bumrah,India,GCA,1993-12-06,31.0,BOWLER,RHB,RIGHT ARM Fast,36,89,62,120,MI,MI,8.0,Capped,200
583,,R2,Rinku,Singh,India,UPCA,1997-10-12,27.0,BATTER,LHB,RIGHT ARM Off Spin,0,0,15,48,KKR,KKR,4.0,Uncapped,50
584,,R2,Kuldeep,Yadav,India,UPCA,1994-12-14,30.0,BOWLER,RHB,LEFT ARM Chinaman,10,108,35,82,KOL,DC,6.0,Capped,150
585,,R2,Abhishek,Sharma,India,PCA,2000-09-04,25.0,ALL-ROUNDER,LHB,LEFT ARM Slow Orthodox,0,0,0,56,SRH,SRH,6.0,Uncapped,30
586,,R2,Nicholas,Pooran,West Indies,,1995-10-02,29.0,WICKETKEEPER,LHB,,0,67,88,62,PBKS,LSG,6.0,Capped,150
587,,R2,Shivam,Dube,India,MCA,1993-06-26,32.0,ALL-ROUNDER,LHB,RIGHT ARM Medium,1,2,21,51,RCB,CSK,4.0,Capped,75
588,,R2,MS,Dhoni,India,JSCA,1981-07-07,44.0,WICKETKEEPER,RHB,RIGHT ARM Medium,90,350,98,264,CSK,CSK,16.0,Capped,200
589,,R2,Ravi,Bishnoi,India,UPCA,2000-09-05,24.0,BOWLER,RHB,RIGHT ARM Leg Spin,0,2,24,53,PBKS,LSG,3.0,Capped,75
590,,R2,Yashasvi,Jaiswal,India,MCA,2001-12-28,23.0,BATTER,LHB,RIGHT ARM Leg Spin,15,5,18,28,RR,RR,3.0,Capped,75
591,,R2,Shubman,Gill,India,PBCA,1999-09-08,25.0,BATTER,RHB,RIGHT ARM Off Spin,27,44,27,91,KKR,GT,4.0,Capped,200
592,,R2,Varun,Chakravarthy,India,TNCA,1991-08-29,33.0,BOWLER,RHB,RIGHT ARM Leg Spin,0,0,6,56,KKR,KKR,3.0,Uncapped,50
593,,R3,Harshit,Rana,India,DDCA,2001-12-22,23.0,BOWLER,RHB,RIGHT ARM Fast,,0,0,26,23,KKR,KKR,2.0,Uncapped,30
594,,R3,Sai,Sudharsan,India,TNCA,2001-10-15,23.0,BATTER,LHB,,0,0,0,23,GT,GT,2.0,Uncapped,30
595,,R3,Andre,Russell,West Indies,,1988-04-29,37.0,ALL-ROUNDER,RHB,RIGHT ARM Fast,1,56,72,112,DD,KKR,13.0,Capped,150
596,,R4,Shimron,Hetmeyer,Guyana,,1996-12-26,27.0,BATTER,LHB,RIGHT ARM Leg Spin,0,60,74,74,RCB,RR,7.0,Capped,150
597,,R3,Ravindra,Jadeja,India,SAU,1988-12-06,36.0,ALL-ROUNDER,LHB,LEFT ARM Spin,67,197,64,232,RR,CSK,16.0,Capped,200
598,,R3,Heinrich,Klaasen,South Africa,,1991-07-30,33.0,WICKETKEEPER,RHB,RIGHT ARM Off Spin,4,48,49,18,SRH,SRH,3.0,Capped,150
599,,R3,Matheesha,Pathirana,Sri Lanka,,2002-12-18,22.0,BOWLER,RHB,RIGHT ARM Fast,0,2,24,14,CSK,CSK,2.0,Capped,75
600,,R3,Rashid,Khan,Afghanistan,,1998-09-20,27.0,BOWLER,RHB,RIGHT ARM Leg Spin,5,100,85,109,SRH,GT,6.0,Capped,200
601,,R3,Hardik,Pandya,India,BCA,1993-10-11,31.0,ALL-ROUNDER,RHB,RIGHT ARM Fast Medium,11,74,92,123,MI,MI,7.0,Capped,200
602,,R3,Axar,Patel,India,GCA,1994-01-20,31.0,ALL-ROUNDER,LHB,LEFT ARM Spin,12,60,44,123,MI,DC,9.0,Capped,150
603,,R3,Dhruv,Jurel,India,RCA,2001-01-21,24.0,WICKETKEEPER,RHB,,0,0,7,18,RR,RR,2.0,Uncapped,30
604,,R3,Pat,Cummins,Australia,,1993-05-08,32.0,BOWLER,RHB,RIGHT ARM Fast,66,96,52,62,KKR,SRH,4.0,Capped,200
605,,R3,Mayank,Agarwal,India,KSCA,1991-02-16,34.0,BATTER,RHB,RIGHT ARM Off Spin,21,5,4,123,PBKS,SRH,9.0,Capped,100
606,,R3,Tristan,Stubbs,South Africa,,2000-08-14,25.0,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,0,1,17,20,MI,SRH,1.0,Capped,75
607,,R3,Tilak,Varma,India,HCA,2002-11-08,22.0,BATTER,LHB,RIGHT ARM Off Spin,0,0,10,35,MI,MI,2.0,Uncapped,30
608,,R3,Ramandeep,Singh,India,PCA,1997-04-13,28.0,ALL-ROUNDER,RHB,RIGHT ARM Medium,,0,0,0,11,MI,MI,2.0,Uncapped,30
609,,R3,Abhishek,Porel,India,BCA,2002-10-17,22.0,WICKETKEEPER,LHB,,0,0,2,10,DC,DC,2.0,Uncapped,30
610,,R3,Yash,Dayal,India,UPCA,1997-12-13,27.0,BOWLER,LHB,LEFT ARM Fast Medium,,0,0,0,16,GT,RCB,3.0,Uncapped,30
611,,R3,Riyan,Parag,India,ASA,2001-11-10,23.0,ALL-ROUNDER,RHB,RIGHT ARM Leg Spin,,0,0,0,54,RR,RR,6.0,Uncapped,30
612,,R3,Sandeep,Sharma,India,HPCA,1993-05-18,32.0,BOWLER,RHB,RIGHT ARM Medium,,0,0,0,124,PBKS,RR,5.0,Uncapped,50
613,,R3,Shashank,Singh,India,MPCA,1991-11-21,33.0,ALL-ROUNDER,RHB,RIGHT ARM Medium,,0,0,0,21,SRH,PBKS,2.0,Uncapped,30
614,,R3,Prabhsimran,Singh,India,PCA,2000-08-10,24.0,WICKETKEEPER,RHB,RIGHT ARM Off Spin,,0,0,0,32,PBKS,PBKS,2.0,Uncapped,30
615,,R3,Sharukh,Khan,India,TNCA,1995-05-27,30.0,ALL-ROUNDER,RHB,RIGHT ARM Off Spin,,0,0,0,33,PBKS,PBKS,2.0,Uncapped,30
616,,R3,Rajat,Patidar,India,MPCA,1993-06-01,32.0,BATTER,RHB,,0,0,0,30,RCB,RCB,2.0,Uncapped,30
617,,R3,Jofra,Archer,England,,1995-04-01,30.0,BOWLER,RHB,RIGHT ARM Fast,13,21,15,36,RR,MI,2.0,Capped,200
618,,R3,Rahul,Tewatia,India,HCA,1993-05-20,31.0,ALL-ROUNDER,LHB,RIGHT ARM Leg Spin,,0,0,0,88,SRH,GT,5.0,Uncapped,50
619,,R4,Mayank,Yadav,India,UPCA,2002-06-17,22.0,BOWLER,RHB,RIGHT ARM Fast,0,3,7,17,LSG,LSG,2.0,Uncapped,20
620,,R4,Ayush,Badoni,India,DDCA,1999-12-03,24.0,BATTER,RHB,RIGHT ARM Off Spin,0,3,14,56,LSG,LSG,2.0,Uncapped,20
621,,R4,Mohsin,Khan,India,UPCA,1998-07-15,25.0,BOWLER,LHB,LEFT ARM Medium,0,1,13,26,MI,LSG,3.0,Uncapped,20
"""  # add the rest of your data lines here

def us_date_to_iso(us_date: str) -> str:
    if not us_date.strip():
        return ""
    try:
        dt = datetime.strptime(us_date.strip(), "%m/%d/%Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return us_date  # fallback

def parse_int(value: str) -> int:
    try:
        return int(value)
    except (ValueError, TypeError):
        return 0

def parse_nullable_int(value: str) -> Any:
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

def parse_player_row(row: List[str]) -> Dict[str, Any]:
    return {
        "srNo": parse_int(row[0]),
        "setNo": row[1],
        "set2025": row[2],
        "firstName": row[3],
        "surname": row[4],
        "country": row[5],
        "state": row[6],
        "dob": us_date_to_iso(row[7]),
        "age": parse_int(row[8]),
        "specialism": row[9],
        "hand": row[10],
        "specialiceat": row[11],
        "testCaps": parse_nullable_int(row[12]),
        "odiCaps": parse_nullable_int(row[13]),
        "t20Caps": parse_nullable_int(row[14]),
        "ipl": row[15],
        "previousIPLTeams": row[16],
        "team2024": row[17],
        "ipl2024": row[18],
        "category": row[19],
        "reservePriceRsLakh": parse_int(row[20]),
        "uploadedBy": "system"
    }

def parse_csv_to_json(csv_text: str) -> List[Dict[str, Any]]:
    players = []
    reader = csv.reader(csv_text.strip().splitlines(), skipinitialspace=True)
    for row in reader:
        if len(row) < 21:
            # Skip invalid rows
            continue
        player = parse_player_row(row)
        players.append(player)
    return players

if __name__ == "__main__":
    players_json = parse_csv_to_json(csv_data)
    with open("players_output.txt", "w", encoding="utf-8") as f:
        json.dump(players_json, f, indent=2)

