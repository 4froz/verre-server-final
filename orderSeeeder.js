import { faker } from "@faker-js/faker";
import fs from "fs";

// User data
const users = [
  {
    _id: "6751993efff74b4bbc1f6fd3",
    name: "Otis Crooks",
    email: "Marcelle.Stanton37@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/53832621",
    createdAt: "2024-12-05T12:12:34.048Z",
    updatedAt: "2024-12-05T12:12:34.049Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd4",
    name: "Kirk Koss",
    email: "Vincent.Yost@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/13055867",
    createdAt: "2024-12-05T12:12:34.049Z",
    updatedAt: "2024-12-05T12:12:34.049Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd5",
    name: "Maureen Hoeger Sr.",
    email: "Ayden_Bergnaum81@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/18891808",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd6",
    name: "Nathaniel Hegmann",
    email: "Savannah_Carroll@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/19816785",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd7",
    name: "Alan Crooks",
    email: "Jodie89@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/32218947",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd8",
    name: "Samantha Wintheiser",
    email: "Sandy_Ward@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/57934071",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fd9",
    name: "Mandy Hoeger",
    email: "Jasper_Predovic85@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/50019323",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fda",
    name: "Jamie Smith",
    email: "Fern_Emmerich34@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/19841342",
    createdAt: "2024-12-05T12:12:34.050Z",
    updatedAt: "2024-12-05T12:12:34.050Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fdb",
    name: "Dr. Keith Pollich",
    email: "Gladys_Graham@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/8787760",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fdc",
    name: "Ryan Blanda III",
    email: "Garland.Kilback53@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/78256807",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fdd",
    name: "Caleb Deckow DVM",
    email: "Jana.Krajcik17@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/24246768",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fde",
    name: "Roger Witting",
    email: "Makenzie.Hessel-Daniel@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/485527",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fdf",
    name: "Cody Keebler",
    email: "Lillian.Bartell@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/80148038",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe0",
    name: "Bennie Halvorson-Bogan",
    email: "Ezra26@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/73368330",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe1",
    name: "Manuel Runolfsson",
    email: "Mikel.OKeefe@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/79159523",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe2",
    name: "Bill Wyman",
    email: "Rick.Kreiger95@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/89911162",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe3",
    name: "Tamara Schulist",
    email: "Rosella.Reichert21@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/68245345",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe4",
    name: "Archie Nikolaus DVM",
    email: "Kavon_Robel@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/24747574",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe5",
    name: "Kimberly Stracke",
    email: "Rosella71@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/92816171",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe6",
    name: "Stacey Leffler",
    email: "Deondre.Ortiz@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/3071549",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe7",
    name: "Carmen Volkman",
    email: "Ewell.Volkman67@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/14777049",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe8",
    name: "Eugene Hand",
    email: "Meda.Green@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/95250101",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fe9",
    name: "Dr. Christie Cartwright",
    email: "Melba.Mills18@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/59705819",
    createdAt: "2024-12-05T12:12:34.051Z",
    updatedAt: "2024-12-05T12:12:34.051Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fea",
    name: "Sheila Steuber",
    email: "Jarret_Gorczany21@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/26836318",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6feb",
    name: "Roxanne Torp III",
    email: "Bennie.Kris@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/12384847",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fec",
    name: "Aaron O'Conner",
    email: "Arturo84@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/45748719",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fed",
    name: "Terrell Collins IV",
    email: "Justina42@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/81241936",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fee",
    name: "Mr. Robert Turcotte",
    email: "Kyle.Hyatt@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/94938358",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fef",
    name: "Mr. Jonathon Vandervort",
    email: "Angeline56@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/6811715",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff0",
    name: "Stephanie Graham",
    email: "Myah.Hagenes@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/19025504",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff1",
    name: "Henry Kuphal",
    email: "Alize_Reynolds67@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/89357824",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff2",
    name: "Salvador Kunze",
    email: "Antonietta.Hilpert-Abernathy@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/93335294",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff3",
    name: "Erica Hermiston",
    email: "Ida61@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/265275",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff4",
    name: "Russell Deckow",
    email: "Saige20@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/14064440",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff5",
    name: "Olivia Batz",
    email: "Marcelina24@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/75985711",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff6",
    name: "Calvin Vandervort",
    email: "Lorine17@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/22286903",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff7",
    name: "Vickie Mayer",
    email: "Liza.Harris@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/89814034",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff8",
    name: "Marco Abernathy",
    email: "Maritza4@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/65617763",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ff9",
    name: "Felicia Hayes",
    email: "Cortney77@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/11542394",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ffa",
    name: "Horace Vandervort",
    email: "Desmond_Collins77@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/70188660",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ffb",
    name: "Alyssa Keeling",
    email: "Madge_Langworth66@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/45642452",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ffc",
    name: "Miss Gwen Effertz",
    email: "Kayli.Schumm@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/79844834",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ffd",
    name: "Dr. Noel Feil",
    email: "Waylon.DAmore-Simonis70@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/88913233",
    createdAt: "2024-12-05T12:12:34.052Z",
    updatedAt: "2024-12-05T12:12:34.052Z",
  },
  {
    _id: "6751993efff74b4bbc1f6ffe",
    name: "Lester Nikolaus",
    email: "Jimmy.Lehner22@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/99953020",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f6fff",
    name: "Dana Grant",
    email: "Wilton_Stroman94@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/58092491",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7000",
    name: "Elvira Wiza PhD",
    email: "Wyman_Weber@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/81200331",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7001",
    name: "Terri Tromp",
    email: "Brain44@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/20778627",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7002",
    name: "Mario Heidenreich-Okuneva",
    email: "Jessie.Kshlerin@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/65064984",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7003",
    name: "Melissa Legros",
    email: "Jeremie35@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/88064302",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7004",
    name: "Lorenzo Robel Jr.",
    email: "Blaise_Ratke@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/33649570",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7005",
    name: "Danny Ernser",
    email: "Randy_Hartmann99@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/59144341",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7006",
    name: "Dr. Ignacio Beatty",
    email: "Virgie5@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/36844077",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7007",
    name: "Marcia Hermiston",
    email: "Milton_Lueilwitz@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/66949927",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7008",
    name: "Rickey Kreiger Jr.",
    email: "Preston9@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/64310381",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f7009",
    name: "Rosalie Strosin",
    email: "Theodore_Prosacco@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/40336084",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f700a",
    name: "Darrel Homenick",
    email: "Anna.Stokes@hotmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/57126400",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f700b",
    name: "Gabriel Bartell",
    email: "Jesus89@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/61189059",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f700c",
    name: "Cheryl Lang",
    email: "Dortha_Bartell@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/3466626",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f700d",
    name: "Beth Zboncak",
    email: "Rachelle_Schinner69@yahoo.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/73588765",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
  {
    _id: "6751993efff74b4bbc1f700e",
    name: "Mamie Marquardt",
    email: "Daniella_Yost19@gmail.com",
    isAdmin: false,
    profilePic: "https://avatars.githubusercontent.com/u/27728246",
    createdAt: "2024-12-05T12:12:34.053Z",
    updatedAt: "2024-12-05T12:12:34.053Z",
  },
];

// Product data
const products = [
  {
    name: "Blissful Orchid Set",
    image:
      "https://static.wixstatic.com/media/796073_41c96511d5654fcab105ab18631e6e0e~mv2.jpg/v1/fill/w_625,h_938,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/796073_41c96511d5654fcab105ab18631e6e0e~mv2.jpg",

    price: 6890,
  },
  {
    name: "Raaha Velvet Jacket",
    image:
      "https://static.wixstatic.com/media/796073_c1b821d287244fe7a9db7a40f57fce8f~mv2.jpg/v1/fill/w_625,h_833,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/796073_c1b821d287244fe7a9db7a40f57fce8f~mv2.jpg",

    price: 7250,
  },
  {
    name: "Aza Co-ord Set",
    image:
      "https://static.wixstatic.com/media/796073_b7974d9699ce45b4b563de1e8939f394~mv2.jpg/v1/fill/w_625,h_938,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/796073_b7974d9699ce45b4b563de1e8939f394~mv2.jpg",

    price: 7600,
  },
  {
    name: "Oxblood Hand Embroidered Top",
    image:
      "https://static.wixstatic.com/media/796073_ab70994738d94128be38878524310066~mv2.jpeg/v1/fill/w_625,h_833,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/796073_ab70994738d94128be38878524310066~mv2.jpeg",

    price: 8190,
  },
  {
    name: "Rebecca Striped Crop Top",
    image:
      "https://static.wixstatic.com/media/796073_c0632a14d2bb4d369f9a7f06e5235c3b~mv2.jpeg/v1/fill/w_440,h_661,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/796073_c0632a14d2bb4d369f9a7f06e5235c3b~mv2.jpeg",

    price: 9190,
  },
  {
    name: "Rebecca Striped Crop Top",
    image:
      "https://static.wixstatic.com/media/796073_c4c6f30290004b22bd1b331cab59e0f5~mv2.jpg/v1/fill/w_440,h_660,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/796073_c4c6f30290004b22bd1b331cab59e0f5~mv2.jpg",

    price: 9190,
  },
];

// Delivery statuses for November
const novemberStatuses = ["Processing", "Processed", "Dispatched", "Delivered"];

// Generate random orders
// const generateOrders = (count) => {
//   const orders = [];

//   // Create date range as Date objects
//   const startDate = new Date("2024-01-01");
//   const endDate = new Date("2024-12-31");

//   for (let i = 0; i < count; i++) {
//     const randomUser = users[Math.floor(Math.random() * users.length)];
//     const randomProduct = products[Math.floor(Math.random() * products.length)];

//     // Generate a random date within the 2024 range
//     let randomMonth;
//     try {
//       // Always use UTC when generating dates
//       randomMonth = new Date(
//         faker.date.between({ from: startDate, to: endDate })
//       );
//     } catch (error) {
//       console.error("Error generating date:", error);
//       randomMonth = new Date(); // Fallback to current date
//     }

//     const isNovember = randomMonth.getMonth() === 11; // November (0-based index)
//     const normalizedDate = new Date(randomMonth).toISOString();
//     console.log(randomMonth);

//     const order = {
//       id: faker.helpers.arrayElement([
//         "6751993efff74b4bbc1f6fd3",
//         "67519a950f71357ee891f893",
//         "67519a750f71357ee891f0a2",
//         "67519ab00f71357ee892009a",
//         "6751993efff74b4bbc1f6fd4",
//         "6751993efff74b4bbc1f6fd5",
//         "6751993efff74b4bbc1f6fd6",
//         "6751993efff74b4bbc1f6fd7",
//         "6751993efff74b4bbc1f6fd8",
//         "6751993efff74b4bbc1f6fd9",
//         "6751993efff74b4bbc1f6fda",
//         "6751993efff74b4bbc1f6fdb",
//         "6751993efff74b4bbc1f6fdc",
//         "6751993efff74b4bbc1f6fdd",
//         "6751993efff74b4bbc1f6fde",
//         "6751993efff74b4bbc1f6fdf",
//         "6751993efff74b4bbc1f6fe0",
//         "6751993efff74b4bbc1f6fe1",
//         "6751993efff74b4bbc1f6fe2",
//         "6751993efff74b4bbc1f6fe3",
//         "6751993efff74b4bbc1f6fe4",
//         "6751993efff74b4bbc1f6fe5",
//         "6751993efff74b4bbc1f6fe6",
//         "6751993efff74b4bbc1f6fe7",
//         "6751993efff74b4bbc1f6fe8",
//         "6751993efff74b4bbc1f6fe9",
//         "6751993efff74b4bbc1f6fea",
//         "6751993efff74b4bbc1f6feb",
//         "6751993efff74b4bbc1f6fec",
//         "6751993efff74b4bbc1f6fed",
//         "6751993efff74b4bbc1f6fee",
//         "6751993efff74b4bbc1f6fef",
//         "6751993efff74b4bbc1f6ff0",
//         "6751993efff74b4bbc1f6ff1",
//         "6751993efff74b4bbc1f6ff2",
//         "6751993efff74b4bbc1f6ff3",
//         "6751993efff74b4bbc1f6ff4",
//         "6751993efff74b4bbc1f6ff5",
//         "6751993efff74b4bbc1f6ff6",
//         "6751993efff74b4bbc1f6ff7",
//         "6751993efff74b4bbc1f6ff8",
//         "6751993efff74b4bbc1f6ff9",
//         "6751993efff74b4bbc1f6ffa",
//         "6751993efff74b4bbc1f6ffb",
//         "6751993efff74b4bbc1f6ffc",
//         "6751993efff74b4bbc1f6ffd",
//         "6751993efff74b4bbc1f6ffe",
//         "6751993efff74b4bbc1f6fff",
//         "6751993efff74b4bbc1f7000",
//         "6751993efff74b4bbc1f7001",
//         "6751993efff74b4bbc1f7002",
//         "6751993efff74b4bbc1f7003",
//         "6751993efff74b4bbc1f7004",
//         "6751993efff74b4bbc1f7005",
//         "6751993efff74b4bbc1f7006",
//         "6751993efff74b4bbc1f7007",
//         "6751993efff74b4bbc1f7008",
//         "6751993efff74b4bbc1f7009",
//         "6751993efff74b4bbc1f700a",
//         "6751993efff74b4bbc1f700b",
//         "6751993efff74b4bbc1f700c",
//         "6751993efff74b4bbc1f700d",
//         "6751993efff74b4bbc1f700e",
//       ]),
//       user: {
//         name: randomUser.name,
//         email: randomUser.email,
//       },
//       orderItems: [
//         {
//           name: randomProduct.name,
//           price: randomProduct.price,
//           size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
//           image: randomProduct.image,
//         },
//       ],
//       shippingAddress: {
//         address: faker.location.streetAddress(),
//         city: faker.location.city(),
//         pincode: faker.location.zipCode(),
//       },
//       paymentMethod: "Online",
//       note: faker.lorem.sentence(),
//       itemsPrice: randomProduct.price,
//       shippingPrice: 200,
//       totalPrice: randomProduct.price + 200,
//       deliveryStatus: isNovember
//         ? faker.helpers.arrayElement(novemberStatuses)
//         : "Delivered",
//       createdAt: randomMonth,
//       isCancelled: false,
//     };

//     orders.push(order);
//   }

//   return orders;
// };

const generateOrders = (count) => {
  const orders = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  // Distribute orders across months in increasing order
  const monthDistribution = Array.from({ length: 12 }, (_, i) => (i + 1) * 10); // Adjust weights as needed
  const totalWeight = monthDistribution.reduce((a, b) => a + b, 0);

  const monthlyCounts = monthDistribution.map((weight) =>
    Math.round((weight / totalWeight) * count)
  );

  // Correct rounding errors to match the total count
  let totalOrders = monthlyCounts.reduce((a, b) => a + b, 0);
  monthlyCounts[11] += count - totalOrders; // Add the difference to December if any

  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(2024, month, 1);
    const monthEnd = new Date(2024, month + 1, 0);

    for (let i = 0; i < monthlyCounts[month]; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];

      const randomDate = faker.date.between({
        from: monthStart,
        to: monthEnd,
      });

      const order = {
        id: faker.helpers.arrayElement([
          "6751993efff74b4bbc1f6fd3",
          "67519a950f71357ee891f893",
          "67519a750f71357ee891f0a2",
          "67519ab00f71357ee892009a",
          "6751993efff74b4bbc1f6fd4",
          "6751993efff74b4bbc1f6fd5",
          "6751993efff74b4bbc1f6fd6",
          "6751993efff74b4bbc1f6fd7",
          "6751993efff74b4bbc1f6fd8",
          "6751993efff74b4bbc1f6fd9",
          "6751993efff74b4bbc1f6fda",
          "6751993efff74b4bbc1f6fdb",
          "6751993efff74b4bbc1f6fdc",
          "6751993efff74b4bbc1f6fdd",
          "6751993efff74b4bbc1f6fde",
          "6751993efff74b4bbc1f6fdf",
          "6751993efff74b4bbc1f6fe0",
          "6751993efff74b4bbc1f6fe1",
          "6751993efff74b4bbc1f6fe2",
          "6751993efff74b4bbc1f6fe3",
          "6751993efff74b4bbc1f6fe4",
          "6751993efff74b4bbc1f6fe5",
          "6751993efff74b4bbc1f6fe6",
          "6751993efff74b4bbc1f6fe7",
          "6751993efff74b4bbc1f6fe8",
          "6751993efff74b4bbc1f6fe9",
          "6751993efff74b4bbc1f6fea",
          "6751993efff74b4bbc1f6feb",
          "6751993efff74b4bbc1f6fec",
          "6751993efff74b4bbc1f6fed",
          "6751993efff74b4bbc1f6fee",
          "6751993efff74b4bbc1f6fef",
          "6751993efff74b4bbc1f6ff0",
          "6751993efff74b4bbc1f6ff1",
          "6751993efff74b4bbc1f6ff2",
          "6751993efff74b4bbc1f6ff3",
          "6751993efff74b4bbc1f6ff4",
          "6751993efff74b4bbc1f6ff5",
          "6751993efff74b4bbc1f6ff6",
          "6751993efff74b4bbc1f6ff7",
          "6751993efff74b4bbc1f6ff8",
          "6751993efff74b4bbc1f6ff9",
          "6751993efff74b4bbc1f6ffa",
          "6751993efff74b4bbc1f6ffb",
          "6751993efff74b4bbc1f6ffc",
          "6751993efff74b4bbc1f6ffd",
          "6751993efff74b4bbc1f6ffe",
          "6751993efff74b4bbc1f6fff",
          "6751993efff74b4bbc1f7000",
          "6751993efff74b4bbc1f7001",
          "6751993efff74b4bbc1f7002",
          "6751993efff74b4bbc1f7003",
          "6751993efff74b4bbc1f7004",
          "6751993efff74b4bbc1f7005",
          "6751993efff74b4bbc1f7006",
          "6751993efff74b4bbc1f7007",
          "6751993efff74b4bbc1f7008",
          "6751993efff74b4bbc1f7009",
          "6751993efff74b4bbc1f700a",
          "6751993efff74b4bbc1f700b",
          "6751993efff74b4bbc1f700c",
          "6751993efff74b4bbc1f700d",
          "6751993efff74b4bbc1f700e",
        ]),
        user: {
          name: randomUser.name,
          email: randomUser.email,
        },
        orderItems: [
          {
            name: randomProduct.name,
            price: randomProduct.price,
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
            image: randomProduct.image,
          },
        ],
        shippingAddress: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          pincode: faker.location.zipCode(),
        },
        paymentMethod: "Online",
        note: faker.lorem.sentence(),
        itemsPrice: randomProduct.price,
        shippingPrice: 200,
        totalPrice: randomProduct.price + 200,
        deliveryStatus:
          month === 11 // December (0-based index)
            ? faker.helpers.arrayElement(["Processing", "Processed", "Dispatched"])
            : "Delivered",
        createdAt: randomDate,
        isCancelled: false,
      };

      orders.push(order);
    }
  }

  return orders;
};




// Generate 3000 orders
const fakeOrders = generateOrders(250);

// Write to JSON file for testing
fs.writeFileSync("fakeOrders.json", JSON.stringify(fakeOrders, null, 2));

console.log("Fake orders generated successfully!");
