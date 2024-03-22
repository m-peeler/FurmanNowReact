import { Alert } from 'react-native';
import * as NativeContact from 'expo-contacts';

export function formatPhoneNumber(phone : string) : string | undefined {
  if (phone.length !== 10) {
    return undefined;
  }
  const areaCode = phone.slice(0, 3);
  const firstHalf = phone.slice(3, 6);
  const secondHalf = phone.slice(6, 10);
  return `(${areaCode}) ${firstHalf}-${secondHalf}`;
}

export class Contact {
  name: string;
  number: number;
  company?: string; 
  constructor(name: string, number: number, company="Furman University") {
    this.name = name;
    this.number = number;
    this.company = company
  }
}

class InsertableContact implements NativeContact.Contact {
  contactType: NativeContact.ContactTypes = NativeContact.ContactTypes.Person;
  name: string;
  firstName?: string | undefined;
  phoneNumbers: NativeContact.PhoneNumber[];
  company: string;

  constructor(contact: Contact) {
    this.name = contact.name;
    this.firstName = contact.name;
    this.phoneNumbers = [{
      number: formatPhoneNumber(contact.number.toString()),
      isPrimary: true,
      digits: contact.number.toString(),
      countryCode: 'US',
      label: 'mobile',
    }];
    this.company = contact.company ? contact.company : "Furman University";
  }
}

const saveContact = async (cont : Contact) => {
  const { status, canAskAgain } = await NativeContact.getPermissionsAsync();
  let stat = status;  
  const contact = new InsertableContact(cont);
  console.log(contact);
  if (stat !== NativeContact.PermissionStatus.GRANTED && canAskAgain) {
    ({ status: stat } = await NativeContact.requestPermissionsAsync());
  }
  console.log(2);
  if (stat !== NativeContact.PermissionStatus.GRANTED) return;

  try {
    console.log(3);
    const val = await NativeContact.addContactAsync(contact)
    console.log(val);
    Alert.alert('Completed', `Successfully added ${contact.name} to your contacts.`)
  } catch (e) {
    console.log("HELP");
    console.log(e);
  }
};

export function requestAddAlert(cont: Contact) {
  Alert.alert(
    'Add Contact?',
    `Would you like to add ${cont.name} to your contact book?`,
    [
      { text: 'Cancel', onPress: () => { } },
      { text: 'Ok', onPress: () => saveContact(cont), isPreferred: true },
    ],
  );
}
