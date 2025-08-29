export default function CriteriaSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-10 md:px-20 space-y-12">
                <div className="bg-white/50 p-8 md:p-12 rounded-2xl shadow-lg backdrop-blur-sm">
                    <h3 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800 text-center">
                        Eligibility Criteria
                    </h3>
                    <ol className="criteria-list">
                        <li>
                            <span className="font-semibold">Alumni Requirement:</span> Must have graduated before the year
                            2000 from PSG College of Technology.
                        </li>
                        <li>
                            Must be the <span className="font-semibold">founder or co-founder</span> of the company/firm.
                        </li>
                        <li>
                            <span className="font-semibold">Entrepreneurship Type:</span> Must be a first-generation
                            entrepreneur. In the case of a second-generation entrepreneur, the business must be entirely
                            unrelated to the family’s existing business.
                        </li>
                        <li>
                            <span className="font-semibold">Company/firm Registration:</span> The entity should be a registered
                            technology company/firm.
                        </li>
                        <li>
                            <span className="font-semibold">Business Domain:</span> The company/firm must be in one of the
                            following domains: Technology / Engineering Product Company/firm, Manufacturing, Construction &amp;
                            Infrastructure Technology, Textile &amp; Apparel Technology, Healthcare &amp; Biotechnology,
                            Energy &amp; Clean Tech, Agri &amp; Food Processing Technology, Industrial Automation &amp;
                            Robotics, Communication Technology, Materials.
                        </li>
                        <li>
                            <span className="font-semibold">Company/firm Scale:</span> Annual turnover should exceed ₹100 crores
                            and must employ over 100 full-time employees. (May be relaxed for IP-based ventures.)
                        </li>
                        <li>
                            <span className="font-semibold">Innovation and IP:</span> Companies/firms that have published
                            Intellectual Property Rights (IPRs), such as patents, trademarks, or copyrights.
                        </li>
                        <li>
                            Companies that have undergone{' '}
                            <span className="font-semibold">mergers/acquisitions exceeding ₹100 crores</span> are eligible.
                        </li>
                        <li>
                            <span className="font-semibold">Academic Collaboration:</span> Must actively collaborate with
                            academic or research institutions for R&amp;D or innovation incubation.
                        </li>
                        {/* <li>
                            <span className="font-semibold">Innovation &amp; IP:</span> Companies holding valid IPRs.
                        </li>
                        <li>
                            <span className="font-semibold">International Presence:</span> Foreign collaborations or global
                            operations.
                        </li>
                        <li>
                            <span className="font-semibold">Awards &amp; Recognitions:</span> Notable national/international
                            awards, certifications, or recognitions in business, innovation, or social impact.
                        </li>
                        <li>
                            <span className="font-semibold">Sustainability &amp; Impact:</span> Demonstrated growth and
                            significant contributions to employment and/or societal development.
                        </li>
                        <li>
                            <span className="font-semibold">Ethics &amp; Compliance:</span> Clean legal and regulatory record;
                            strong business ethics.
                        </li> */}
                    </ol>
                </div>
            </div>
        </section>
    )
}
