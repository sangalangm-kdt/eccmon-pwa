export const sections = [
  "getStarted",
  "installApp",
  "signIn",
  "usingQRScanner",
  "stepByStep",
  "menu",
  "settings",
  "reportIssue",
  "changeLanguage",
  "logOut",
  "performanceTips",
  "developerTeam",
];

export const renderSectionContent = (section, t) => {
  const content = {
    getStarted: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("getStarted")}
          </h2>
        </div>
        <div className="my-2 border-t-0.5 border-gray-300" />
        <p dangerouslySetInnerHTML={{ __html: t("inventoryOverview") }} />{" "}
      </div>
    ),
    installApp: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("installApp")}
          </h2>
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <h4 className="text-md font-semibold leading-relaxed">
          {t("installAppSafari")}
        </h4>
        <pre className="whitespace-pre-line leading-relaxed">
          {t("installAppSafariInstructions")}
        </pre>
      </div>
    ),
    signIn: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("signIn")}
          </h2>
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <ul>
          <li className="mb-2 leading-relaxed">{t("openAppAndSignIn")}</li>
          <li
            dangerouslySetInnerHTML={{ __html: t("firstTimeUserRegister") }}
            className="leading-relaxed"
          />
        </ul>
      </div>
    ),
    usingQRScanner: (
      <div className="flex flex-col gap-1">
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("usingQRScanner")}
          </h2>
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <h4 className="text-base font-semibold leading-relaxed">
          {t("openScanner")}
        </h4>
        <p className="leading-relaxed">{t("tapScanQRButton")}</p>
        <h4 className="text-base font-semibold leading-relaxed">
          {t("scanCylinderQR")}
        </h4>
        <p className="leading-relaxed">{t("pointCameraAtQR")}</p>
        <h4 className="text-base font-semibold leading-relaxed">
          {t("operations")}
        </h4>

        {/* Mapping submenu options dynamically */}
        {Object.values(t("submenuOptions", { returnObjects: true })).map(
          (option) => (
            <div key={option.title}>
              <h4 className="text-md font-semibold leading-relaxed text-gray-800 dark:text-gray-50">
                {option.title}
              </h4>
              <ul className="ml-4">
                {option.description &&
                  option.description.map((desc, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {desc}
                    </li>
                  ))}
                {option.cases &&
                  Object.values(option.cases).map((caseDesc, idx) => (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: caseDesc.toString() }} // Ensure caseDesc is a string
                      className="ml-6 list-disc leading-relaxed"
                    />
                  ))}
              </ul>
            </div>
          ),
        )}

        <p dangerouslySetInnerHTML={{ __html: t("optional") }} />

        <h4 className="text-base font-semibold leading-relaxed">
          {t("viewDetails")}
        </h4>
        <p className="leading-relaxed">{t("detailsDisplayed")}</p>

        <h4 className="text-base font-semibold leading-relaxed">
          {t("updateCylinderCover")}
        </h4>
        <p
          className="leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: t("updateCylinderCoverInstructions"),
          }}
        />
      </div>
    ),
    stepByStep: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("stepByStep")}
          </h2>
        </div>
        <div className="my-2 border-t-0.5 border-gray-300" />
        {Object.values(t("stepByStepMenu", { returnObjects: true })).map(
          (option, idx) => (
            <div key={idx}>
              <h4 className="text-md font-semibold leading-relaxed text-gray-800 dark:text-gray-50">
                {option.title}
              </h4>
              <ul className="ml-4">
                {option.description &&
                  option.description.map((desc, index) => (
                    <li key={index} className="leading-relaxed">
                      {desc}
                    </li>
                  ))}
                {option.steps &&
                  option.steps.map((step, index) => (
                    <li
                      key={index}
                      className="ml-6 list-disc text-sm leading-relaxed"
                    >
                      <strong>{step.title}:</strong> {step.instruction}
                    </li>
                  ))}
              </ul>
            </div>
          ),
        )}
      </div>
    ),

    menu: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("menu")}
          </h2>
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed">{t("useSidebarToNavigate")}</p>
      </div>
    ),
    settings: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("settings")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed">{t("managePreferences")}</p>
      </div>
    ),
    reportIssue: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("reportIssue")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed">{t("submitBugReport")}</p>
      </div>
    ),
    changeLanguage: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("changeLanguage")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed">{t("switchBetweenLanguages")}</p>
      </div>
    ),
    logOut: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("logOut")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed">{t("secureLogOut")}</p>
      </div>
    ),
    performanceTips: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("performanceTips")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <ul>
          <li className="leading-relaxed">{t("stableConnection")}</li>
          <li className="leading-relaxed">{t("keepAppUpdated")}</li>
        </ul>
      </div>
    ),
    developerTeam: (
      <div>
        <div className="border-l-4 border-primary pl-4 dark:border-primary">
          {" "}
          <h2 className="text-lg font-semibold leading-relaxed text-cyan-700 dark:text-cyan-100">
            {t("developerTeam")}
          </h2>{" "}
        </div>

        <div className="my-2 border-t-0.5 border-gray-300" />
        <p className="leading-relaxed text-gray-800 dark:text-gray-50">
          Meet the individuals behind ECCMon.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-100">
              Dexmel Mico O. Hernandez
            </strong>
            <br />
            <span className="text-gray-600 dark:text-gray-200">
              PIC/Back-End Developer
            </span>
            <br />
            <a
              href="mailto:hernandez-kdt@global.kawasaki.com"
              className="text-primary underline"
            >
              hernandez-kdt@global.kawasaki.com
            </a>
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-100">
              Marielle D. Sangalang
            </strong>{" "}
            <br />
            <span className="text-gray-600 dark:text-gray-200">
              PWA/Mobile Front-End Developer
            </span>
            <br />
            <a
              href="mailto:sangalang_m-kdt@global.kawasaki.com"
              className="text-primary underline"
            >
              sangalang_m-kdt@global.kawasaki.com
            </a>
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-100">
              Rhanzces Julia O. Herrera
            </strong>{" "}
            <br />
            <span className="text-gray-600 dark:text-gray-200">
              Web Front-End Developer
            </span>
            <br />
            <a
              href="mailto:herrera-kdt@global.kawasaki.com"
              className="text-primary underline"
            >
              herrera-kdt@global.kawasaki.com
            </a>
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-100">
              Vonn Jezreel B. Pactol
            </strong>{" "}
            <br />{" "}
            <span className="text-gray-600 dark:text-gray-200">
              Back-End Developer
            </span>
            <br />
            <a
              href="mailto:pactol-kdt@global.kawasaki.com"
              className="text-primary underline"
            >
              pactol-kdt@global.kawasaki.com
            </a>
          </li>
        </ul>
      </div>
    ),
  };

  return content[section];
};
