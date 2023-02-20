import { Helmet } from "react-helmet-async"
import ScrollableLink from '../../components/ScrollableLink'
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function PrivacyPolicy() {
  const app = useSelector(selectApp)

  return (
    <>
    <Helmet>
      <title>{ `${ app?.appName || "Veltech Inc." } | Privacy Policy` }</title>
    </Helmet>
    
  <div className="relative flex flex-col justify-between min-h-screen">
    <div className="mx-10 lg:mx-36 my-10 lg:my-15">
    <div className="flex flex-col gap-y-5 w-full lg:w-3/4 mt-5 lg:mt-10">
            <h1 className="text-[3rem] text-[#0B2653] leading-none font-grandview-bold">Privacy Policy </h1> 
            <p>Effective date: 2021-11-01 </p>
            <h5 className="text-[1rem] text-[#5A5A5A] font-grandview-light pb-5">We care about your Privacy.<br/><br/> Our Commitment to being upfront about the data we gather about you,<br/> and within whom it is shared is important to this objective. <br/><br/> When you our Services, you are bound by our Privacy Policy (described below), <br/> As we provide our users with choices regarding the data we collect, use, and disclose.
            <div className=' gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <div className="flex flex-col gap-y-1.5">
                  <span className="text-xl font-grandview-bold text-[#000]">Table of Contents</span>
                  
                  {
                    [
                    <ScrollableLink label={'License to use Website'} targetId={'license'} targetPath={''}/>, 
                    <ScrollableLink label={'Acceptable use'} targetId={'acceptable'} targetPath={''}/>, 
                    <ScrollableLink label={'User Content'} targetId={'userContent'} targetPath={''}/>, 
                    <ScrollableLink label={'Content Information'} targetId={'contentInformation'} targetPath={''}/>, 
                    <ScrollableLink label={'Limitations of Liability'} targetId={'liability'} targetPath={''}/>,
                    <ScrollableLink label={'Exceptions'} targetId={'exceptions'} targetPath={''}/>,
                    <ScrollableLink label={'Other Parties'} targetId={'otherParties'} targetPath={''}/>,
                    <ScrollableLink label={'Unenforceable Provisions'} targetId={'provisions'} targetPath={''}/>,
                    <ScrollableLink label={'Indemnity'} targetId={'indemnity'} targetPath={''}/>,
                    <ScrollableLink label={'Breaches of this privacy policy'} targetId={'breaches'} targetPath={''}/>,
                    <ScrollableLink label={'Variation'} targetId={'variation'} targetPath={''}/>,
                    <ScrollableLink label={'Assignment'} targetId={'assignment'} targetPath={''}/>,
                    <ScrollableLink label={'Severability'} targetId={'sverability'} targetPath={''}/>,
                    <ScrollableLink label={'Entire Agreement'} targetId={'agreement'} targetPath={''}/>,
                    <ScrollableLink label={'Law and Juristriction'} targetId={'juristriction'} targetPath={''}/>,
                  ].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div> 
             </div>
            <br/>
             VELTECH.COM.PH uses cookies. By using this website and agreeing to these privacy policy, you consent to Veltech’ use of cookies in accordance with the terms of Veltech’ privacy policy. 
             <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            
            <span id='license' className="text-xl font-grandview-bold pt-5 text-[#000]">License to use website </span><br/> 
            Unless otherwise stated, Veltech and/or its licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved. 

            You may view, download for caching purposes only, and print pages or any other content from the website for your own personal use, subject to the restrictions set out below and elsewhere in these privacy policy. 

            You must not: <br/>
            Republish material from this website (including republication on another website); 
            sell, rent or sub-license material from the website; 
            show any material from the website in public; 
            reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose; 
            edit or otherwise modify any material on the website; or 
            redistribute material from this website except for content specifically and expressly made available for redistribution. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='acceptable' className="text-xl font-grandview-bold pt-5 text-[#000]">Acceptable use </span><br/> 
            You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity. 

            You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software. 

            You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without Veltech’ express written consent. 

            You must not use this website to transmit or send unsolicited commercial communications. 

            You must not use this website for any purposes related to marketing without Veltech’ express written consent. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            
            <span className="text-xl font-grandview-bold pt-5 text-[#000]">Restricted access  </span><br/> 
            Access to certain areas of this website is restricted. Veltech reserves the right to restrict access to other areas of this website, or indeed this entire website, at Veltech’ discretion. 

            If Veltech provides you with a user ID and password to enable you to access restricted areas of this website or other content or services, you must ensure that the user ID and password are kept confidential. 

            Veltech may disable your user ID and password in Veltech’ sole discretion without notice or explanation. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='userContent' className="text-xl font-grandview-bold pt-5 text-[#000]">User Content </span><br/> 
            In these privacy policy, “your user content” means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose. 

            You grant to Veltech a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media. You also grant to Veltech the right to sub-license these rights, and the right to bring an action for infringement of these rights. 

            Your user content must not be illegal or unlawful, must not infringe any third party’s legal rights, and must not be capable of giving rise to legal action whether against you or Veltech or a third party (in each case under any applicable law). 

            You must not submit any user content to the website that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaints. 

            Veltech reserves the right to edit or remove any material submitted to this website, or stored on Veltech’ servers, or hosted or published upon this website. 

            Notwithstanding Veltech’ rights under these privacy policy in relation to user content, Veltech does not undertake to monitor the submission of such content to, or the publication of such content on, this website. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='contentInformation' className="text-xl font-grandview-bold pt-5 text-[#000]">Content Information</span><br/> 
            Veltech undertakes serious effort to provide accurate descriptions of the products posted on VELTECH.COM.PH. 

            Without prejudice to the generality of the foregoing paragraph, Veltech does not warrant that: 

            this website will be constantly available, or available at all; or 
            the information on this website is complete, true, accurate or non-misleading.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='liability' className="text-xl font-grandview-bold pt-5 text-[#000]">Limitations of Liability</span><br/> 
            Veltech will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website: 

            to the extent that the website is provided free-of-charge, for any direct loss; for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data. 
            arising directly or indirectly in connection with any system, server or connection failure, error, omission, interruption, delay in transmission, computer virus or other malicious, destructive or corrupting code, agent program or macros; and any use of or access to any other website or webpage linked to the site. 

            Any risk of misunderstanding, error, damage, expense or losses resulting from the use of the site is entirely at your own risk and we shall not be liable therefor. 

            These limitations of liability apply even if Veltech has been expressly advised of the potential loss. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='exceptions' className="text-xl font-grandview-bold pt-5 text-[#000]">Exceptions</span><br/> 
            Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit, and nothing in this website disclaimer will exclude or limit Veltech’ liability in respect of any: 

            death or personal injury caused by Veltech’ negligence; 
            fraud or fraudulent misrepresentation on the part of Veltech; or 
            a matter which it would be illegal or unlawful for Veltech to exclude or limit, or to attempt or purport to exclude or limit, its liability. 
            Reasonableness 
            By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable. 

            If you do not think they are reasonable, you must not use this website. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='otherParties' className="text-xl font-grandview-bold pt-5 text-[#000]">Other parties</span><br/> 
            You accept that, as a limited liability entity, Veltech has an interest in limiting the personal liability of its officers and employees. You agree that you will not bring any claim personally against Veltech’ officers or employees in respect of any losses you suffer in connection with the website. 

            Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect Veltech officers, employees, agents, subsidiaries, successors, assigns and sub-contractors as well as Veltech. 

            
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='provisions' className="text-xl font-grandview-bold pt-5 text-[#000]">Unenforceable Provisions</span><br/> 
            If any provision of this website disclaimer is or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer. 
            </p>

            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='indemnity' className="text-xl font-grandview-bold pt-5 text-[#000]">Indemnity</span><br/> 
            You hereby indemnify Veltech and undertake to keep Veltech indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by Veltech to a third party in settlement of a claim or dispute on the advice of Veltech legal advisers) incurred or suffered by Veltech arising out of any breach by you of any provision of these privacy policy, or arising out of any claim that you have breached any provision of these privacy policy. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='breaches' className="text-xl font-grandview-bold pt-5 text-[#000]">Breaches of these privacy policy</span><br/> 
            Without prejudice to Veltech’ other rights under these privacy policy, if you breach these privacy policy in any way, Veltech may take such action as Veltech deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='variation' className="text-xl font-grandview-bold pt-5 text-[#000]">Variation </span><br/> 
            Veltech may revise these privacy policy from time-to-time. Revised privacy policy will apply to the use of this website from the date of the publication of the revised privacy policy on this website. Please check this page regularly to ensure you are familiar with the current version. 


            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='assignment' className="text-xl font-grandview-bold pt-5 text-[#000]">Assignment  </span><br/> 
            Veltech may transfer, sub-contract or otherwise deal with Veltech’ rights and/or obligations under these privacy policy without notifying you or obtaining your consent. 

            You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these privacy policy. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='sverability' className="text-xl font-grandview-bold pt-5 text-[#000]">Severability  </span><br/> 
            If a provision of these privacy policy is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='agreement' className="text-xl font-grandview-bold pt-5 text-[#000]">Entire Agreement  </span><br/> 
            These privacy policy constitute the entire agreement between you and Veltech in relation to your use of this website and supersede all previous agreements in respect of your use of this website. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='juristriction' className="text-xl font-grandview-bold pt-5 text-[#000]">Law and Jurisdiction  </span><br/> 
            These privacy policy will be governed by and construed in accordance with the Philippine Constitutions, and any disputes relating to these privacy policy will be subject to the exclusive jurisdiction of the courts of Philippines. If one or more of the provisions contained in this Agreement is held invalid, illegal or unenforceable in any respect by any court of competent jurisdiction, such holding will not impair the validity, legality, or enforceability of the remaining provisions. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span className="text-xl font-grandview-bold pt-5 text-[#000]">Credit   </span><br/> 
            This document was created using a Contractology template available at http://www.contractology.com.
            </p>
            {/* <div className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <div className="flex flex-col gap-y-1.5">
                  <span className="text-xl font-grandview-bold text-[#000]">Table of Contents</span>
                  {
                    [
                      <ScrollableLink label={'Introduction'} targetId={'introduction'} targetPath={''}/>, 
                      <ScrollableLink label={'Definitions'} targetId={'definitions'} targetPath={''}/>, 
                      <ScrollableLink label={'Information Collection and Use'} targetId={'collection'} targetPath={''}/>, 
                      <ScrollableLink label={'Types of Data Collected'} targetId={'collected'} targetPath={''}/>, 
                      <ScrollableLink label={'Usage of Data'} targetId={'data'} targetPath={''}/>,
                      <ScrollableLink label={'Location of Data'} targetId={'location'} targetPath={''}/>,
                      <ScrollableLink label={'Tracking Cookies Data'} targetId={'tracking'} targetPath={''}/>,
                      "Other Data",
                      <ScrollableLink label={'Transfer of Data'} targetId={'transfer'} targetPath={''}/>,
                      <ScrollableLink label={'Retention of Data '} targetId={'retention'} targetPath={''}/>,
                      <ScrollableLink label={'Disclosure of Data'} targetId={'disclosure'} targetPath={''}/>,
                      <ScrollableLink label={'Security of Data '} targetId={'republic'} targetPath={''}/>,
                      <ScrollableLink label={'REPUBLIC ACT NO. 10173 or also knows as the Data Privacy Act of 2012'} targetId={'security'} targetPath={''}/>,
                      <ScrollableLink label={'Service Providers '} targetId={'service'} targetPath={''}/>,
                      <ScrollableLink label={'Links to Other Sites'} targetId={'sites'} targetPath={''}/>,
                      <ScrollableLink label={'Children`s Privacy'} targetId={'privacy'} targetPath={''}/>,
                    ].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div> 
             </div>
            
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='introduction' className="text-xl font-grandview-bold text-[#000]">Introduction</span><br/> 
            Welcome to Veltech. 

            Veltech (“us”, “we”, or “our”) operates Veltech.com.ph (hereinafter referred to as “Service”). 

            Our Privacy Policy governs your visit to Veltech.com.ph, and explains how we collect, safeguard and disclose information that results 
            from your use of our Service. 

            We use your data to provide and improve Service. By using Service, you agree to the collection and use of information in accordance 
            with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our 
            privacy policy. 

            Our privacy policy (“Terms”) govern all use of our Service and together with the Privacy Policy constitutes your agreement 
            with us (“agreement”). 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='definitions' className="text-xl font-grandview-bold text-[#000]">Definitions </span><br/> 
            SERVICE means the Veltech.com.ph website operated by Veltech. 

            PERSONAL DATA means data about a living individual who can be identified from those data (or from those and other information either 
            in our possession or likely to come into our possession). 

            USAGE DATA is data collected automatically either generated by the use of Service or from Service infrastructure itself (for example, the 
            duration of a page visit). 

            COOKIES are small files stored on your device (computer or mobile device). 

            DATA CONTROLLER means a natural or legal person who (either alone or jointly or in common with other persons) determines the 
            purposes for which and the manner in which any personal data are, or are to be, processed. For the purpose of this Privacy Policy, 
            we are a Data Controller of your data. 

            DATA PROCESSORS (OR SERVICE PROVIDERS) means any natural or legal person who processes the data on behalf of the Data Controller. 
            We may use the services of various Service Providers in order to process your data more effectively. 

            DATA SUBJECT is any living individual who is the subject of Personal Data. 

            THE USER is the individual using our Service. The User corresponds to the Data Subject, who is the subject of Personal Data. 
            </p>
            <p  id='collection' className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span className="text-xl font-grandview-bold text-[#000]">Information Collection and Use  </span><br/> 
            We collect several different types of information for various purposes to provide and improve our Service to you. 

            Types of Data Collected 

            Personal Data 

            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to: 
            <div className="flex flex-col gap-y-1.5">
                  <span  className="text-xl font-grandview-bold text-[#000] pt-2"></span>
                  {
                    ["Email address ", "First name and last name ", "Phone number ", "Address, Country, State, Province, ZIP/Postal code, City ", "Cookies and Usage Data ",].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div> <br/>
                We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link. 
            </p>
            <p  id='collected' className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span className="text-xl font-grandview-bold text-[#000]"> Types of Data Collected  </span><br/> 

            Personal Data 

            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to: 
           
                We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='data' className="text-xl font-grandview-bold text-[#000]">Usage of Data </span><br/> 
            We may also collect information that your browser sends whenever you visit our Service or when you access Service by or through any device (“Usage Data”). 

            This Usage Data may include information such as your computer’s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data. 

            When you access Service with a device, this Usage Data may include information such as the type of device you use, your device unique ID, the IP address of your device, your device operating system, the type of Internet browser you use, unique device identifiers and other diagnostic data. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='location' className="text-xl font-grandview-bold text-[#000]">Location of Data  </span><br/> 
            We may use and store information about your location if you give us permission to do so (“Location Data”). We use this data to provide features of our Service, to improve and customize our Service. 

            You can enable or disable location services when you use our Service at any time by way of your device settings. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='tracking' className="text-xl font-grandview-bold text-[#000]">Tracking Cookies Data </span><br/> 
            We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. 

            Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used such as beacons, tags and scripts to collect and track information and to improve and analyze our Service. 

            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service. 

            Examples of Cookies we use: 
            <div className="flex flex-col gap-y-1.5">
                  <span className="text-xl font-grandview-bold text-[#000] pt-2"></span>
                  {
                    ["Session Cookies: We use Session Cookies to operate our Service. ", "Preference Cookies: We use Preference Cookies to remember your preferences and various settings. ", "Security Cookies: We use Security Cookies for security purposes.","Advertising Cookies: Advertising cookies are use to serve you with advertisements that may be relevant to you and your interests. ",].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div> <br/>
            </p>

            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='otherData' className="text-xl font-grandview-bold text-[#000]">Other Data  </span><br/> 
            While using our Service, we may also collect the following information: sex, age, date of birth, place of birth, passport details, citizenship, registration at place of residence and actual address, telephone number (work, mobile), details of documents on education, qualification, professional training, employment agreements, NDA agreements, information on bonuses and compensation, information on marital status, family members, social security (or other taxpayer identification) number, office location and other data. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='retention' className="text-xl font-grandview-bold text-[#000]">Retention of Data  </span><br/> 
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. 

            We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods. 

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='transferData' className="text-xl font-grandview-bold text-[#000]">Transfer of Data  </span><br/> 
            Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. 

            If you are located outside Philippines and choose to provide information to us, please note that we transfer the data, including Personal Data, to Philippines and process it there. 

            Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer. 

            Veltech will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of your data and other personal information. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='disclosure' className="text-xl font-grandview-bold text-[#000]">Disclosure of Data  </span><br/> 
            We may disclose personal information that we collect, or you provide: 
            <div className="flex flex-col gap-y-1.5">
                  <span className="text-xl font-grandview-bold text-[#000] pt-2"></span>
                  {
                    [" Disclosure for Law Enforcement. Under certain circumstances, we may be required to discloseyour Personal Data if required to do so by law or in response to valid requests by public authorities. ", " Business Transaction. If we or our subsidiaries are involved in a merger, acquisition or asset sale, your Personal Data may be transferred. ", "Other cases. We may disclose your information also: ",].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div>
                to our subsidiaries and affiliates; <br/>

                0.3.2. to contractors, service providers, and other third parties we use to support our business; <br/>

                0.3.3. to fulfill the purpose for which you provide it; <br/>

                0.3.4. for the purpose of including your company’s logo on our website; <br/>

                0.3.5. for any other purpose disclosed by us when you provide the information; <br/>

                0.3.6. with your consent in any other cases; <br/>

                0.3.7. if we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span  id='security'  className="text-xl font-grandview-bold text-[#000]">Security of Data  </span><br/> 
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span  id='republic'  className="text-xl font-grandview-bold text-[#000]">Data Protection Rights under the REPUBLIC ACT NO. 10173 or also known as the Data Privacy Act of 2012 </span><br/> 
            Data Privacy Act of 2021 is the policy of the State to protect the fundamental human right of privacy, of communication while ensuring free flow of information to promote innovation and growth. The State recognizes the vital role of information and communications technology in nation-building and its inherent obligation to ensure that personal information in information and communications systems in the government and in the private sector are secured and protected. 

            According to the Privacy Act we agree to the following: 
            <div className="flex flex-col gap-y-1.5">
                  <span  className="text-xl font-grandview-bold text-[#000] pt-2"></span>
                  {
                    [" users can visit our site anonymously; ", " our Privacy Policy link includes the word “Privacy”, and can easily be found on the home page of our website; ", "users will be notified of any privacy policy changes on our Privacy Policy Page; ","users are able to change their personal information by emailing us at support@Veltech.com.ph.",].map((inclusion, index) => (
                      <span className="text-lg font-grandview-light  text-[#000]" key={ `inclusion-${ index + 1 }` }>{ index + 1 }. { inclusion }</span>
                    ))
                  }
                </div><br/>
                Our Policy on “Do Not Track” Signals: 

                We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser mechanism is in place. Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked. 

                You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='service' className="text-xl font-grandview-bold text-[#000]">Service Providers </span><br/> 
            We may employ third party companies and individuals to facilitate our Service (“Service Providers”), provide Service on our behalf, perform Service-related services or assist us in analysing how our Service is used. 

            These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. 

            Links to Other Sites 

            Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit. 

            We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services. 

            For example, the outlined privacy policy has been made using PolicyMaker.io, a free tool that helps create high-quality legal documents. PolicyMaker’s privacy policy generator is an easy-to-use tool for creating a privacy policy for blog, website, e-commerce store or mobile app. 
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='sites' className="text-xl font-grandview-bold text-[#000]">Links to Other Sites </span><br/> 
            Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit. 

            We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services. 

            For example, the outlined privacy policy has been made using PolicyMaker.io, a free tool that helps create high-quality legal documents. PolicyMaker’s privacy policy generator is an easy-to-use tool for creating a privacy policy for blog, website, e-commerce store or mobile app. 
            </p>

            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            <span id='privacy' className="text-xl font-grandview-bold text-[#000]">Children’s Privacy </span><br/> 
            Our Services are not intended for use by children under the age of 18 (“Child” or “Children”). 

            We do not knowingly collect personally identifiable information from Children under 18. If you become aware that a Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers. 

            Changes to This Privacy Policy 

            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 

            We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update “effective date” at the top of this Privacy Policy. 

            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. 
            </p>

            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
            Changes to This Privacy Policy 

            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 

            We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update “effective date” at the top of this Privacy Policy. 

            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. 
            </p> */}
            
            </h5>
            
          </div>
        </div>
    </div>

    </>
  )
}

export default PrivacyPolicy