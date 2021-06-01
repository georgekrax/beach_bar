import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { DATA } from "@/config/data";
import { BeachBarQuery } from "@/graphql/generated";
import { useConfig, useIsDesktop } from "@/utils/hooks";
import { formatNumber } from "@/utils/search";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Button, useWindowDimensions } from "@hashtag-design-system/components";
import uniq from "lodash/uniq";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./BeachBar.module.scss";
import { Favourite } from "./Favourite";
import { Feature } from "./Feature";
import { BeachBarHeading } from "./Heading";
import { Img } from "./Img";
import { Product } from "./Product/Product";
import { Review } from "./Review";
import { Section } from "./Section";

const SHRINKED_DESCRIPTION_LENGTH = 720;

const Header = dynamic(() => {
  const prom = import("./Header").then(mod => mod.Header);
  return prom;
});
const NameAndLocation = dynamic(() => {
  const prom = import("./NameAndLocation").then(mod => mod.NameAndLocation);
  return prom;
});
const Search = dynamic(() => {
  const prom = import("./Search").then(mod => mod.Search);
  return prom;
});
const SearchInfo = dynamic(() => {
  const prom = import("./SearchInfo").then(mod => mod.SearchInfo);
  return prom;
});
const Photos = dynamic(() => {
  const prom = import("./Photos").then(mod => mod.Photos);
  return prom;
});

type SubComponents = {
  Header: typeof Header;
  Review: typeof Review;
  NameAndLocation: typeof NameAndLocation;
  Favourite: typeof Favourite;
  Search: typeof Search;
  Img: typeof Img;
  Product: typeof Product;
  Feature: typeof Feature;
  Section: typeof Section;
  SearchInfo: typeof SearchInfo;
  Photos: typeof Photos;
};

export type Props = {
  reviewScore?: typeof COMMON_CONFIG.DATA.searchFilters.REVIEW_SCORES.EXCELLENT;
  isPhotos?: boolean;
};

const BeachBar: React.FC<Props & NonNullable<BeachBarQuery["beachBar"]>> & SubComponents = ({
  slug,
  name,
  description,
  thumbnailUrl,
  location,
  imgUrls,
  reviews,
  avgRating,
  products,
  defaultCurrency,
  features,
  contactPhoneNumber,
  hidePhoneNumber,
  reviewScore,
  isPhotos = false,
  children,
}) => {
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();
  const {
    variables: { breakpoints },
  } = useConfig();
  const MAX_IMGS = width >= breakpoints.sm ? DATA.MAX_BEACH_IMGS : 3;

  const descriptionInfo = useMemo(() => {
    let res = { sliced: description?.slice(0, SHRINKED_DESCRIPTION_LENGTH), showMore: true, showLess: false };
    if ((description?.length || 0) < SHRINKED_DESCRIPTION_LENGTH) res.showMore = false;
    if (!res.showMore) res.sliced = description;
    if (showExpandedDescription) res = { sliced: description, showMore: false, showLess: true };
    return res;
  }, [description, showExpandedDescription]);
  const sortedFeatures = useMemo(
    () =>
      features.map(({ __typename, ...rest }) => rest).sort((a, b) => parseInt(a.service.id) - parseInt(b.service.id)),
    [features]
  );
  const imgsArr = useMemo(() => imgUrls.slice(0, MAX_IMGS), [imgUrls, MAX_IMGS]);
  const reviewsInfo = useMemo(() => {
    const imgUrls = uniq(
      reviews
        .map(({ customer: { user } }) => user?.account.imgUrl || [])
        .flat()
        .slice(0, MAX_IMGS)
    );
    let length = reviews.length;
    if (length >= 10) {
      const tens = Math.pow(10, length.toString().length - 1);
      length = Math.floor(length / tens) * tens;
    }
    return { imgUrls, length };
  }, [reviews, avgRating]);
  // const formattedSearchDate = useMemo(() => (date ? formatDateShort(date) : undefined), []);

  return (
    <div className={styles.container}>
      <BeachBarHeading name={name} city={location.city.name} />
      <div className={styles.images + " flex-row-flex-start-stretch"}>
        <Img src={thumbnailUrl} layout="fill" quality={100} />
        {imgUrls.length > 0 && (
          <div className={styles.restImgs + " w100 flex-column-flex-start-stretch"}>
            {imgsArr.map(({ id, imgUrl, description }, i) => {
              const last = i === imgsArr.length - 1;

              return (
                <Img
                  key={id}
                  src={imgUrl}
                  alt={description ? description + " - " + name : name.trimEnd() + "'s image"}
                  layout="fill"
                  last={last}
                  description={description}
                >
                  {last && imgUrls.length > MAX_IMGS && (
                    <Link
                      href={{ pathname: "/beach/[...slug]", query: { slug: [slug, "photos"] } }}
                      replace
                      shallow
                      passHref
                    >
                      <a>
                        <div className={styles.moreImgs + " bold header-5 w100 h100 flex-row-center-center"}>
                          +{imgUrls.length - MAX_IMGS}
                        </div>
                      </a>
                    </Link>
                  )}
                </Img>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.details + " flex-column-flex-start-flex-start"}>
        {avgRating > 1.5 && reviews.length > 0 && (
          // <Link href={{ pathname: "/beach/[slug]/reviews", query: { slug } }} replace prefetch={false}>
          <div className={styles.viewReviews + " w100 flex-column-center-flex-start"}>
            <div className="w--inherit flex-row-space-between-center">
              <div className="semibold">
                <span className="bold header-5">{avgRating.toFixed(1)}</span>
                {reviewScore && <div className="d--ib">{reviewScore.name}</div>}
              </div>
              <div className={styles.reviewsUserImgs + " flex-row-center-center"}>
                {reviewsInfo.imgUrls.map((imgUrl, i) => (
                  <Image
                    key={i}
                    src={imgUrl}
                    alt="Review's image"
                    className={
                      styles.reviewUserImg +
                      (i === 0 ? " zi--sm" : i === reviewsInfo.imgUrls.length - 1 ? " zi--none " : "") +
                      " flex-row-center-center border-radius--lg"
                    }
                    width={32}
                    height={32}
                    objectFit="fill"
                  />
                ))}
              </div>
            </div>
            <div className="flex-row-flex-start-center">
              <Next.Link href={{ pathname: "/beach/[...slug]", query: { slug: [slug, "reviews"] } }} replace shallow>
                <a className="body-14">
                  View {reviews.length > reviewsInfo.length ? "+" : ""}
                  {formatNumber(reviewsInfo.length)} review{reviewsInfo.length > 1 ? "s" : ""}
                </a>
              </Next.Link>
              <Icons.Chevron.Right width={14} height={14} />
            </div>
          </div>
          // </Link>
        )}
        <div className={styles.description + " text--grey"}>
          {descriptionInfo.sliced}
          {descriptionInfo.showMore ? (
            <>
              <span>...&nbsp;</span>
              <span className="link" onClick={() => setShowExpandedDescription(true)}>
                read more
              </span>
            </>
          ) : (
            descriptionInfo.showLess && (
              <span className="link" onClick={() => setShowExpandedDescription(false)}>
                &nbsp;Read less
              </span>
            )
          )}
        </div>
      </div>
      <div className={styles.productsPreview + " flex-row-flex-start-flex-start"}>
        {!isPhotos && <SearchInfo />}
        <div className={styles.list}>
          {products.map(({ id, ...props }) => (
            <Product
              key={id}
              defaultCurrencySymbol={defaultCurrency.symbol}
              id={id}
              showComponents={isDesktop}
              addToCart={isDesktop}
              extraDetails={isDesktop}
              {...props}
            />
          ))}
        </div>
      </div>
      <div className={styles.ctaContainer + " w100 h100 flex-row-center-flex-end"}>
        <Link href={{ pathname: "/beach/[...slug]", query: { slug: [slug, "products"] } }} shallow passHref>
          <a className="w--inherit">
            <Button className="w--inherit">View products</Button>
          </a>
        </Link>
      </div>
      <Section header="Facilities">
        <BeachBar.Feature.Container style={{ flexDirection: "column", alignItems: "flex-start" }}>
          {sortedFeatures.map(({ quantity, service: { id, name, icon } }) => (
            <Feature key={id} feature={name} quantity={quantity} iconId={icon.publicId} />
          ))}
        </BeachBar.Feature.Container>
      </Section>
      <Section header="Contact">
        <div>
          <Section.Contact info="Street address" val={location.address} />
          {location.zipCode && <Section.Contact info="Zip code" val={location.zipCode} />}
          {!hidePhoneNumber && (
            <Section.Contact info="Phone number" val={`(+${location.country.callingCode}) ${contactPhoneNumber}`} />
          )}
        </div>
      </Section>
      {children}
    </div>
  );
};

BeachBar.Header = Header;
BeachBar.Review = Review;
BeachBar.NameAndLocation = NameAndLocation;
BeachBar.Favourite = Favourite;
BeachBar.Search = Search;
BeachBar.Img = Img;
BeachBar.Product = Product;
BeachBar.Feature = Feature;
BeachBar.Section = Section;
BeachBar.SearchInfo = SearchInfo;
BeachBar.Photos = Photos;

BeachBar.displayName = "BeachBar";

export default BeachBar;
