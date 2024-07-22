interface Location {
  street: {
    number: number;
    name: string;
  };
  coordinates: {
    latitude: string;
    longitude: string;
  };
  timezone: {
    offset: string;
    description: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: number;
}

export interface Name {
  title: string;
  first: string;
  last: string;
}

interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

interface Dob {
  date: Date;
  age: number;
}

interface Registered {
  date: Date;
  age: number;
}

interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface Student {
  _id: string;
  location: Location;
  gender: string;
  name: Name;
  email: string;
  login: Login;
  dob: Dob;
  registered: Registered;
  phone: string;
  cell: string;
  picture: Picture;
  nat: string;
}
