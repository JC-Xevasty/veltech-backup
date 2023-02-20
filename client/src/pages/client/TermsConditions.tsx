import { Helmet } from "react-helmet-async"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function TermsConditions() {
  const app = useSelector(selectApp)

  return (
    <>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Terms and Conditions`}</title>
      </Helmet>

      <div className="relative flex flex-col justify-between min-h-screen">
        <div className="mx-10 lg:mx-36 my-10 lg:my-15">
          <div className="flex flex-col gap-y-5 w-full lg:w-3/4 mt-5 lg:mt-10">
            <h1 className="text-[3rem] text-[#0B2653] leading-none font-grandview-bold">Terms and Conditions </h1>
            <p>Effective date: 2021-11-01 </p>
            <h5 className="text-[1rem] text-[#5A5A5A] font-grandview-light pb-5">
              
              <span className="ml-5 italic">
                All over these terms and conditions, the Company will be referred as “The Seller” and the
                Customer is referred to as “The Buyer”.
              </span>
              <br /><br />
              <span className="ml-5">
                The policies and rules listed below are included in this Agreement and are incorporated herein by
                this reference. The terms and conditions of this Agreement are subject to change at any moment,
                and <span className="font-grandview-bold">The Seller</span> has the right to post any changes or a new Agreement on this Website. The top
                of this Agreement shall state the last modification date, which <span className="font-grandview-bold">The Seller</span> will use to notify you of
                any changes or updates. After being posted on this website, the modified or revised Agreement
                will come into force. You will be deemed to have accepted any changes or revisions if you
                continue to use the Website after any such changes or a new Agreement have been posted.
                Every time you access the Website, <span className="font-grandview-bold">The Seller</span> advises you to read this Agreement again to make
                sure you comprehend the rules and regulations governing its usage. The terms and conditions of
                any other written agreements you may have with <span className="font-grandview-bold">The Seller</span> for additional goods or services are
                not altered in any manner by this Agreement. Please stop using the Website right away if you do
                not accept this Agreement (including any policies or guidelines referred to it). Please use the print
                function on your browser's toolbar to print this Agreement.
              </span>
              <br /><br />
              <span className="ml-5">
                Now, Therefore, premises considered, both parties hereto and hereunto agreed to the
                following terms and conditions to wit:
              </span>
              <br /><br />
              <ol className="list-[upper-roman]">
                <li><span className="ml-5">
                  That the contract herein encompasses the supply of preventive maintenance and checkup for
                  the services (“Works”) based on the details that will be presented under the future
                  quotations as submitted by <span className="font-grandview-bold">The Seller</span> being part of the contract.</span>
                </li>
                <br />
                <li><span className="ml-5">
                  That the contract price for the supply of Preventive Maintenance and check-up of any
                  installed Works cannot be negotiated or is fixed due to government taxes such as VAT
                  inclusion.</span>
                </li>
                <br />
                <li><span className="ml-5">
                  <span className="font-grandview-bold">The Buyer</span> is willing to pay a full payment equivalent to Fifty Percent (50%) as a
                  representation of the down payment. The remaining Fifty Percent (50%) would be This
                  contract is payable on milestones or progress billing based on the actual completion of the
                  project prescribed for purposes of this contract should have the following requisites:
                  <div className="lg:ml-10">
                    <ol className="list-[lower-alpha]">
                      <li>A retention of ten percent (10%) or higher prior to the amount of the said contract
                        price between <span className="font-grandview-bold">The Seller</span> and <span className="font-grandview-bold">The Buyer</span> commencing from the actual completion
                        turnover was carried out provided that no defects as to workmanship be it structural
                        or otherwise this can be provided the Preventive maintenance of <span className="font-grandview-bold">The Buyer</span>.
                      </li><br />
                      <li>That all labor requirements including tools and equipment utilization, and
                        corresponding supervision specified under the future price quotation to serve as
                        an integral part hereof;
                      </li><br />
                      <li>That the desired agreed installation of Works requirements has been met and
                        satisfied within the future price quotation that will be submitted
                        by <span className="font-grandview-bold">The Seller</span> attached served as an integral part hereof
                      </li>
                    </ol>
                  </div>
                </span>
                </li>
                <br />
                <li>That in the event of <span className="font-grandview-bold">The Buyer</span> ascertaining the existence of defects as to workmanship
                  be it due to inferior preparation or otherwise during the installation,
                  <span className="font-grandview-bold">The Seller</span> undertakes to make the necessary
                  repair at its own cost and expense to correct the same in accordance with the plans and specifications agreed upon.
                </li>
                <br />
                <li>
                  That <span className="font-grandview-bold">The Buyer</span> is free from any liabilities as to the cost of selected materials, labor, the
                  equipment, and its consumables to be utilized including the corresponding supervision
                  therein which is to the account of <span className="font-grandview-bold">The Seller</span>
                </li>
                <br />
                <li>
                  That <span className="font-grandview-bold">The Buyer</span> providing emphasis referred under the preceding Paragraph #5 on
                  liabilities where cost of labor would constitute of said workers or to any third party in the
                  installation and delivery on site where safety is expected to be given highest priority be
                  with <span className="font-grandview-bold">The Seller</span>.
                </li>
                <br />
                <li>
                  That <span className="font-grandview-bold">The Buyer</span> shall also be free from any accident liability that may arise to said
                  workers or to any third party in the installation and delivery on site where safety is
                  expected to be given highest priority be with <span className="font-grandview-bold">The Seller</span>.
                </li>
                <br />
                <li>
                  That all the equipment to be used and utilized in the Works to be carried out by The
                  Seller in favor of <span className="font-grandview-bold">The Buyer</span> shall be of superior made and kind to ensure attainment of
                  desired highest work quality.
                </li>
                <br />
                <li>
                  That hauling and disposal of waste materials, if any as a result of the Works shall be
                  carried out by <span className="font-grandview-bold">The Seller</span> being part of the scope of work that will be present into the
                  future quotation where <span className="font-grandview-bold">The Buyer</span> shall provide the designated disposal area.
                </li>
                <br />
                <li>
                  That all work requirements be it using materials, labor or equipment including
                  supervision shall be on the account of <span className="font-grandview-bold">The Seller</span> unless said works are determined to
                  be additional, not included in or charges from the job descriptions under the agreed
                  quotation, in which case the same shall be borne by <span className="font-grandview-bold">The Buyer</span>.
                </li>
                <br />
                <li>
                  That, the preventive maintenance of any project given to <span className="font-grandview-bold">The Seller</span> will be given a
                  period when agreed upon by both <span className="font-grandview-bold">The Buyer</span> and <span className="font-grandview-bold">The Seller</span>. This shall commence
                  from the issuance of notice to in which case the subject Preventive maintenance and
                  check-up is ready for use and to be used based on its very purpose.
                </li>
                <br />
                <li>
                  That, for purposes of this contract and to serve the interest of both <span className="font-grandview-bold">The Buyer</span> and The
                  Seller, the construction shall only be constituted six days a week. This does not include
                  Sundays and holidays or any other day of work based on the agreement of both parties
                </li>
                <br />
                <li>
                  That, in any case a delay has been committed which was determined to be under the
                  control of <span className="font-grandview-bold">The Seller</span> without prejudice to the interest of <span className="font-grandview-bold">The Buyer</span>, there is a possibility
                  of penalty depending on the contract made between both parties.
                </li>
                <br />
                <li>
                  The failure of either party to enforce its rights under this Agreement at any time for any
                  period shall not be constructed as waiver of such rights.
                </li>
                <br />
                <li>
                  If any part of the agreement is held to be illegal or disrespected neither the validity nor
                  enforceability of the remainder of this Agreement shall be affected negatively
                </li>
                <br />
                <li>
                  No modification of the Agreement will be valid or binding unless it was executed by both
                  parties. This Agreement will be an attachment upon and inure to the benefit of the
                  parties and their respective successors and permitted assigns.
                </li>
                <br />
                <li>
                  Both parties shall agree to keep any information about the other party's business a
                  secret. Any is of a confidential character that comes into its possession under or in
                  connection with this Agreement.
                </li>
                <br />
                <li>
                  The parties shall agree that the Services performed by <span className="font-grandview-bold">The Seller</span> that includes its
                  employees, sub-contractors, or agents shall be as part as an independent contractor and
                  that nothing in the Agreement shall be called a partnership, joint venture, employeeemployer relationship or otherwise within <span className="font-grandview-bold">The Buyer</span>.
                </li>
                <br />
                <li>
                  All earlier statements, discussions, or understandings with regard to the services are
                  replaced by this agreement, which contains the parties' full understanding of the event
                </li>
                <br />
                <li>
                  If a party's inability to fulfill a duty under the terms of the agreement is brought on by
                  events outside of its reasonable control, such as acts of God, war, or labor disputes,
                  neither party will be held responsible.
                </li>
                <br />
                <li>
                  Any one of the parties hereto may not assign the aforementioned Agreement without the
                  other party's permission. The parties to this Agreement, as well as each of their
                  respective successors and allowed assignments, are bound by its terms and stand to
                  gain from it. No person or entity who is not a party to this contract will be granted any
                  rights or benefits under this contract.
                </li>
                <br />
                <li>
                  That, the set agreement between both parties shall only be conducted with honest
                  intentions without reservations in executing the very purpose of this contract.
                </li>
                <br />
                <li>
                  That, the contract executed by <span className="font-grandview-bold">The Buyer</span> and <span className="font-grandview-bold">The Seller</span> shall be governed by all the
                  statutes applicable under the laws and regulations of the Republic of The Philippines.
                </li>
                <br />
                <li>
                  Both parties agreed that any claim or cause of action originating from or related to the
                  aforementioned agreement, in the event of any stipulations being broken, shall be filed
                  solely in the courts of the Philippines.
                </li>
              </ol>
              {/* VELTECH.COM.PH uses cookies. By using this website and agreeing to these terms and conditions, you consent to Veltech’ use of cookies in accordance with the terms of Veltech’ privacy policy.
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>


              <span id='license' className="text-xl font-grandview-bold pt-5 text-[#000]">License to use website </span><br />
              Unless otherwise stated, Veltech and/or its licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.

              You may view, download for caching purposes only, and print pages or any other content from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.

              You must not: <br />
              Republish material from this website (including republication on another website);
              sell, rent or sub-license material from the website;
              show any material from the website in public;
              reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose;
              edit or otherwise modify any material on the website; or
              redistribute material from this website except for content specifically and expressly made available for redistribution.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='acceptable' className="text-xl font-grandview-bold pt-5 text-[#000]">Acceptable use </span><br />
              You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.

              You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.

              You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without Veltech’ express written consent.

              You must not use this website to transmit or send unsolicited commercial communications.

              You must not use this website for any purposes related to marketing without Veltech’ express written consent.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>

              <span className="text-xl font-grandview-bold pt-5 text-[#000]">Restricted access  </span><br />
              Access to certain areas of this website is restricted. Veltech reserves the right to restrict access to other areas of this website, or indeed this entire website, at Veltech’ discretion.

              If Veltech provides you with a user ID and password to enable you to access restricted areas of this website or other content or services, you must ensure that the user ID and password are kept confidential.

              Veltech may disable your user ID and password in Veltech’ sole discretion without notice or explanation.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='userContent' className="text-xl font-grandview-bold pt-5 text-[#000]">User Content </span><br />
              In these terms and conditions, “your user content” means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose.

              You grant to Veltech a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media. You also grant to Veltech the right to sub-license these rights, and the right to bring an action for infringement of these rights.

              Your user content must not be illegal or unlawful, must not infringe any third party’s legal rights, and must not be capable of giving rise to legal action whether against you or Veltech or a third party (in each case under any applicable law).

              You must not submit any user content to the website that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaints.

              Veltech reserves the right to edit or remove any material submitted to this website, or stored on Veltech’ servers, or hosted or published upon this website.

              Notwithstanding Veltech’ rights under these terms and conditions in relation to user content, Veltech does not undertake to monitor the submission of such content to, or the publication of such content on, this website.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='contentInformation' className="text-xl font-grandview-bold pt-5 text-[#000]">Content Information</span><br />
              Veltech undertakes serious effort to provide accurate descriptions of the products posted on VELTECH.COM.PH.

              Without prejudice to the generality of the foregoing paragraph, Veltech does not warrant that:

              this website will be constantly available, or available at all; or
              the information on this website is complete, true, accurate or non-misleading.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='liability' className="text-xl font-grandview-bold pt-5 text-[#000]">Limitations of Liability</span><br />
              Veltech will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:

              to the extent that the website is provided free-of-charge, for any direct loss; for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.
              arising directly or indirectly in connection with any system, server or connection failure, error, omission, interruption, delay in transmission, computer virus or other malicious, destructive or corrupting code, agent program or macros; and any use of or access to any other website or webpage linked to the site.

              Any risk of misunderstanding, error, damage, expense or losses resulting from the use of the site is entirely at your own risk and we shall not be liable therefor.

              These limitations of liability apply even if Veltech has been expressly advised of the potential loss.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='exceptions' className="text-xl font-grandview-bold pt-5 text-[#000]">Exceptions</span><br />
              Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit, and nothing in this website disclaimer will exclude or limit Veltech’ liability in respect of any:

              death or personal injury caused by Veltech’ negligence;
              fraud or fraudulent misrepresentation on the part of Veltech; or
              a matter which it would be illegal or unlawful for Veltech to exclude or limit, or to attempt or purport to exclude or limit, its liability.
              Reasonableness
              By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable.

              If you do not think they are reasonable, you must not use this website.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='otherParties' className="text-xl font-grandview-bold pt-5 text-[#000]">Other parties</span><br />
              You accept that, as a limited liability entity, Veltech has an interest in limiting the personal liability of its officers and employees. You agree that you will not bring any claim personally against Veltech’ officers or employees in respect of any losses you suffer in connection with the website.

              Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect Veltech officers, employees, agents, subsidiaries, successors, assigns and sub-contractors as well as Veltech.


            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='provisions' className="text-xl font-grandview-bold pt-5 text-[#000]">Unenforceable Provisions</span><br />
              If any provision of this website disclaimer is or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.
            </p>

            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='indemnity' className="text-xl font-grandview-bold pt-5 text-[#000]">Indemnity</span><br />
              You hereby indemnify Veltech and undertake to keep Veltech indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by Veltech to a third party in settlement of a claim or dispute on the advice of Veltech legal advisers) incurred or suffered by Veltech arising out of any breach by you of any provision of these terms and conditions, or arising out of any claim that you have breached any provision of these terms and conditions.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='breaches' className="text-xl font-grandview-bold pt-5 text-[#000]">Breaches of these Terms and Conditions</span><br />
              Without prejudice to Veltech’ other rights under these terms and conditions, if you breach these terms and conditions in any way, Veltech may take such action as Veltech deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='variation' className="text-xl font-grandview-bold pt-5 text-[#000]">Variation </span><br />
              Veltech may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the use of this website from the date of the publication of the revised terms and conditions on this website. Please check this page regularly to ensure you are familiar with the current version.


            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='assignment' className="text-xl font-grandview-bold pt-5 text-[#000]">Assignment  </span><br />
              Veltech may transfer, sub-contract or otherwise deal with Veltech’ rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.

              You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these terms and conditions.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='sverability' className="text-xl font-grandview-bold pt-5 text-[#000]">Severability  </span><br />
              If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.
            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='agreement' className="text-xl font-grandview-bold pt-5 text-[#000]">Entire Agreement  </span><br />
              These terms and conditions constitute the entire agreement between you and Veltech in relation to your use of this website and supersede all previous agreements in respect of your use of this website.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span id='juristriction' className="text-xl font-grandview-bold pt-5 text-[#000]">Law and Jurisdiction  </span><br />
              These terms and conditions will be governed by and construed in accordance with the Philippine Constitutions, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Philippines. If one or more of the provisions contained in this Agreement is held invalid, illegal or unenforceable in any respect by any court of competent jurisdiction, such holding will not impair the validity, legality, or enforceability of the remaining provisions.

            </p>
            <p className='gap-y-1 w-full lg:w-3/4 mt-5 lg:mt-10'>
              <span className="text-xl font-grandview-bold pt-5 text-[#000]">Credit   </span><br />
              This document was created using a Contractology template available at http://www.contractology.com.
            </p> */}

            </h5>

          </div>
        </div>
      </div>
    </>
  )
}

export default TermsConditions