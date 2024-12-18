import React from "react";

const About = () => {
  return (
    <div className="bg-base-100 text-base-content py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          About Our Website
        </h1>
        <p className="text-lg mb-4">
          Welcome to our advanced{" "}
          <strong>Website Malicious Link Checker</strong>, your trusted tool for
          online security! Our platform is designed to help you analyze website
          links and detect potentially harmful or malicious URLs with remarkable
          accuracy.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <p className="mb-4">
          Our system evaluates links using{" "}
          <strong>30 distinct parameters</strong> to provide a detailed and
          reliable report on a website’s safety. Below is an overview of the
          parameters we use:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>UsingIP:</strong> Determines if the URL contains an IP
            address instead of a domain name.
          </li>
          <li>
            <strong>LongURL:</strong> Checks if the URL length is unusually
            long, which can indicate phishing.
          </li>
          <li>
            <strong>ShortURL:</strong> Identifies if the link uses a URL
            shortening service.
          </li>
          <li>
            <strong>Symbol@:</strong> Detects the presence of the ‘@’ symbol,
            which is often used in phishing links.
          </li>
          <li>
            <strong>Redirecting//:</strong> Checks for multiple slashes (‘//’)
            used for redirection.
          </li>
          <li>
            <strong>PrefixSuffix-:</strong> Detects hyphens in the domain, a
            common trait of malicious sites.
          </li>
          <li>
            <strong>SubDomains:</strong> Analyzes the number of subdomains to
            assess legitimacy.
          </li>
          <li>
            <strong>HTTPS:</strong> Confirms the presence of HTTPS protocol for
            secure communication.
          </li>
          <li>
            <strong>DomainRegLen:</strong> Measures the domain registration
            length to determine trustworthiness.
          </li>
          <li>
            <strong>Favicon:</strong> Checks if the favicon matches the website
            domain.
          </li>
          <li>
            <strong>NonStdPort:</strong> Detects the use of non-standard ports.
          </li>
          <li>
            <strong>HTTPSDomainURL:</strong> Verifies if the HTTPS protocol is
            correctly implemented across the domain.
          </li>
          <li>
            <strong>RequestURL:</strong> Assesses if external resources are
            being loaded.
          </li>
          <li>
            <strong>AnchorURL:</strong> Analyzes anchor tags to ensure they
            don’t redirect users to malicious sites.
          </li>
          <li>
            <strong>LinksInScriptTags:</strong> Checks links embedded in script
            tags.
          </li>
          <li>
            <strong>ServerFormHandler:</strong> Evaluates the behavior of
            server-side form handling.
          </li>
          <li>
            <strong>InfoEmail:</strong> Identifies email addresses embedded in
            the website.
          </li>
          <li>
            <strong>AbnormalURL:</strong> Flags URLs with abnormal structures.
          </li>
          <li>
            <strong>WebsiteForwarding:</strong> Detects if the website forwards
            users to multiple different pages.
          </li>
          <li>
            <strong>StatusBarCust:</strong> Checks for custom status bar
            messages that may deceive users.
          </li>
          <li>
            <strong>DisableRightClick:</strong> Analyzes if the website disables
            right-click functionality.
          </li>
          <li>
            <strong>UsingPopupWindow:</strong> Flags the use of intrusive pop-up
            windows.
          </li>
          <li>
            <strong>IframeRedirection:</strong> Detects malicious iframe
            redirection techniques.
          </li>
          <li>
            <strong>AgeofDomain:</strong> Measures the domain’s age to gauge
            trustworthiness.
          </li>
          <li>
            <strong>DNSRecording:</strong> Checks for DNS record anomalies.
          </li>
          <li>
            <strong>WebsiteTraffic:</strong> Analyzes website traffic data.
          </li>
          <li>
            <strong>PageRank:</strong> Evaluates the website’s Google PageRank.
          </li>
          <li>
            <strong>GoogleIndex:</strong> Confirms if the website is indexed by
            Google.
          </li>
          <li>
            <strong>LinksPointingToPage:</strong> Measures the number of links
            pointing to the webpage.
          </li>
          <li>
            <strong>StatsReport:</strong> Provides an overall statistical
            analysis of the URL.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Accuracy:</strong> By leveraging state-of-the-art machine
            learning models like ResMLP, Random Forest, and Naive Bayes, we
            deliver precise and reliable reports.
          </li>
          <li>
            <strong>Comprehensive Analysis:</strong> Our 30-parameter system
            ensures no detail is overlooked.
          </li>
          <li>
            <strong>User-Friendly Interface:</strong> Designed with simplicity
            and functionality, our platform is easy to navigate.
          </li>
          <li>
            <strong>Fast Results:</strong> Get detailed reports in seconds,
            empowering you to make informed decisions.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p className="mb-4">
          Our mission is to create a safer online environment for individuals
          and organizations by providing cutting-edge tools to combat cyber
          threats.
        </p>

        <p className="text-center text-lg font-medium mt-8">
          Explore our platform and safeguard your digital presence today!
        </p>
      </div>
    </div>
  );
};

export default About;
