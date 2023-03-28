import Modal from 'react-native-modal';
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {UIButton} from './UIButton';
import {AppColors} from '../utils/colors';

interface IPrivacyPolicyModal {
  isVisible: boolean;
  setIsVisible: () => void;
}

export const PrivacyPolicyModal: React.FC<IPrivacyPolicyModal> = ({
  isVisible,
  setIsVisible,
}) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={setIsVisible}>
      <ScrollView style={styles.container}>
        <Text
          style={[
            styles.text,
            {fontSize: 18, fontWeight: '800', textAlign: 'center'},
          ]}>
          Terms & Privacy Policy
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          DVNKXLY Privacy Policy
        </Text>
        <Text style={[styles.text, {textAlign: 'auto'}]}>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from
          (the “App”).
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          PERSONAL INFORMATION WE COLLECT
        </Text>
        <Text style={styles.text}>
          When you visit the App, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the App, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the App, and information
          about how you interact with the App. We refer to this
          automatically-collected information as “Device Information.”
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          We collect Device Information using the following technologies:
        </Text>
        <Text style={styles.text}>
          We collect Device Information using the following technologies: - “Log
          files” track actions occurring on the App, and collect data including
          your IP address, browser type, Internet service provider,
          referring/exit pages, and date/time stamps. - “Web beacons,” “tags,”
          and “pixels” are electronic files used to record information about how
          you browse the App. [[INSERT DESCRIPTIONS OF OTHER TYPES OF TRACKING
          TECHNOLOGIES USED]] Additionally when you make a purchase or attempt
          to make a purchase through the App, we collect certain information
          from you, including your name, billing address, shipping address,
          payment information (including credit card numbers [[INSERT ANY OTHER
          PAYMENT TYPES ACCEPTED]]), email address, and phone number. We refer
          to this information as “Order Information.”
        </Text>
        <Text
          style={[
            styles.text,
            {fontSize: 15, fontWeight: '600', textAlign: 'auto'},
          ]}>
          [[INSERT ANY OTHER INFORMATION YOU COLLECT: OFFLINE DATA, PURCHASED
          MARKETING DATA/LISTS]]
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          When we talk about “Personal Information” in this Privacy Policy, we
          are talking both about Device Information and Order Information.
        </Text>
        <Text
          style={[
            styles.text,
            {fontSize: 15, fontWeight: '600', textAlign: 'auto'},
          ]}>
          HOW DO WE USE YOUR PERSONAL INFORMATION?
        </Text>
        <Text style={styles.text}>
          We use the Order Information that we collect generally to fulfill any
          orders placed through the App (including processing your payment
          information, arranging for shipping, and providing you with invoices
          and/or order confirmations). Additionally, we use this Order
          Information to: Communicate with you; Screen our orders for potential
          risk or fraud; and When in line with the preferences you have shared
          with us, provide you with information or advertising relating to our
          products or services.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          [[INSERT OTHER USES OF ORDER INFORMATION]]
        </Text>
        <Text style={styles.text}>
          We use the Device Information that we collect to help us screen for
          potential risk and fraud (in particular, your IP address), and more
          generally to improve and optimize our App (for example, by generating
          analytics about how our customers browse and interact with the App,
          and to assess the success of our marketing and advertising campaigns).
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          [[INSERT OTHER USES OF DEVICE INFORMATION, INCLUDING:
          ADVERTISING/RETARGETING]]
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          SHARING YOUR PERSONAL INFORMATION
        </Text>
        <Text style={styles.text}>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. For example, we use
          Shopify to power our online store--you can read more about how Shopify
          uses your Personal Information here:
          https://www.shopify.com/legal/privacy. We also use Google Analytics to
          help us understand how our customers use the App--you can read more
          about how Google uses your Personal Information here:
          https://www.google.com/intl/en/policies/privacy/. You can also opt-out
          of Google Analytics here: https://tools.google.com/dlpage/gaoptout.
          And so on... and so on... and so on. And yep, by agreeing Terms &
          Privacy Policy, you are signing a contract with the Devil.
        </Text>
        <Text style={styles.text}>
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          [[INCLUDE IF USING REMARKETING OR TARGETED ADVERTISING]]
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          BEHAVIOURAL ADVERTISING
        </Text>
        <Text style={styles.text}>
          As described above, we use your Personal Information to provide you
          with targeted advertisements or marketing communications we believe
          may be of interest to you. For more information about how targeted
          advertising works, you can visit the Network Advertising Initiative’s
          (“NAI”) educational page at
          http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
        </Text>
        <Text style={styles.text}>
          You can opt out of targeted advertising by:
        </Text>
        <Text style={styles.text}>
          [[ INCLUDE OPT-OUT LINKS FROM WHICHEVER SERVICES BEING USED. COMMON
          LINKS INCLUDE: FACEBOOK - https://www.facebook.com/settings/?tab=ads
          GOOGLE - https://www.google.com/settings/ads/anonymous BING -
          https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads
          ]]
        </Text>
        <Text style={styles.text}>
          Additionally, you can opt out of some of these services by visiting
          the Digital Advertising Alliance’s opt-out portal at:
          http://optout.aboutads.info/.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          DO NOT TRACK
        </Text>
        <Text style={styles.text}>
          Please note that we do not alter our App’s data collection and use
          practices when we see a Do Not Track signal from your browser.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          [[INCLUDE IF LOCATED IN OR IF STORE HAS CUSTOMERS IN EUROPE]]
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          YOUR RIGHTS
        </Text>
        <Text style={styles.text}>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below. Additionally, if you are a European resident we note that we
          are processing your information in order to fulfill contracts we might
          have with you (for example if you make an order through the App), or
          otherwise to pursue our legitimate business interests listed above.
          Additionally, please note that your information will be transferred
          outside of Europe, including to Canada and the United States.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          DATA RETENTION
        </Text>
        <Text style={styles.text}>
          When you place an order through the App, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          [[INSERT IF AGE RESTRICTION IS REQUIRED]]
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          MINORS
        </Text>
        <Text style={styles.text}>
          The App is not intended for individuals under the age of [[INSERT
          AGE]].
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          CHANGES
        </Text>
        <Text style={styles.text}>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          CONTACT US
        </Text>
        <Text style={styles.text}>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at random@gmail.com or by mail using the details provided
          below:
        </Text>
        <Text style={[styles.text, {fontSize: 15, fontWeight: '600'}]}>
          Odeska oblast, Odesa, 65037, Ukraine
        </Text>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <UIButton
            text={'Got it'}
            onPress={setIsVisible}
            marginBottom={30}
            marginTop={10}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: AppColors.inputFont,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 600,
  },
  container: {margin: 5},
  text: {
    margin: 10,
    fontFamily: 'Mulish',
    fontSize: 14,
    textAlign: 'justify',
  },
});
