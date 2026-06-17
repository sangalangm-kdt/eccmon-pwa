import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";
import SiteNameOptionsSkeleton from "./skeleton/SiteNameOptions";
import SearchableOptionField from "./SearchableOptionField";

const SiteNameOptions = ({
  site,
  setSite,
  disabled,
  showAlert,
  onOptionsAvailabilityChange,
  showUnconfiguredMessage = false,
}) => {
  const { data, isLoading } = useLocationProcess("site");
  const { t } = useTranslation();

  const siteList = data?.data || [];

  return (
    <SearchableOptionField
      label={t("qrScanner:siteName")}
      value={site === "None" ? "" : site}
      placeholder={t("qrScanner:selectaSite")}
      title={t("qrScanner:selectSiteName")}
      searchPlaceholder={t("qrScanner:searchSiteNames")}
      options={siteList}
      onChange={setSite}
      disabled={disabled}
      required
      groupByLetter
      isLoading={isLoading}
      loadingContent={<SiteNameOptionsSkeleton />}
      onOptionsAvailabilityChange={onOptionsAvailabilityChange}
      showUnconfiguredMessage={showUnconfiguredMessage}
      error={
        showAlert && !site ? (
          <p className="mt-1 text-xs text-red-600">
            {t("qrScanner:validation.siteRequired")}
          </p>
        ) : null
      }
    />
  );
};

export default SiteNameOptions;
