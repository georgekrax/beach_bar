<<<<<<< HEAD
import { BeachBarQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Button } from "@hashtag-design-system/components";
import uniq from "lodash/uniq";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./BeachBar.module.scss";
import { Favourite } from "./Favourite";
import { Feature } from "./Feature";
import { Header } from "./Header";
import { BeachBarHeading } from "./Heading";
import { Img } from "./Img";
import { NameAndLocation } from "./NameAndLocation";
import { Product } from "./Product/Product";
import { Review } from "./Review";
import { Search } from "./Search";
import { SearchInfo } from "./SearchInfo";
import { Section } from "./Section";

const SHRINKED_DESCRIPTION_LENGTH = 720;

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
};

export type Props = {
  reviewScore?: typeof COMMON_CONFIG.DATA.searchFilters.REVIEW_SCORES.EXCELLENT;
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
}) => {
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);

  const { dispatch } = useSearchContext();

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
  const imgsArr = useMemo(
    () => imgUrls.slice(0, 3),
    [imgUrls]
    // .concat(imgUrls.slice(0, 3).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())),
  );
  const reviewsInfo = useMemo(() => {
    const imgUrls = uniq(
      reviews
        .map(({ customer: { user } }) => user?.account.imgUrl || [])
        .flat()
        .slice(0, 3)
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
          <div className={styles.restImgs + " w100 flex-row-flex-start-stretch"}>
            {imgsArr.map(({ id, imgUrl, description }, i) => (
              <Img key={id} src={imgUrl} alt={description && description + " - " + name} layout="fill">
                {i === imgsArr.length - 1 && imgUrls.length > 3 && (
                  <Link href={{ pathname: "/beach/[slug]/photos", query: { slug } }}>
                    <div className={styles.moreImgs + " h100 bold header-5 w100 flex-row-center-center"}>
                      +{imgUrls.length - 3}
                    </div>
                  </Link>
                )}
              </Img>
            ))}
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
                      (i === 0 ? " zi--md" : i === reviewsInfo.imgUrls.length - 1 ? " zi--none " : "") +
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
              {/* <Next.Link href={{ pathname: "/beach/[slug]/reviews", query: { slug } }}>
                <a className="body-14">
                  View {reviews.length > reviewsInfo.length ? "+" : ""}
                  {formatNumber(reviewsInfo.length)} review{reviewsInfo.length > 1 ? "s" : ""}
                </a>
              </Next.Link>
              <Icons.Chevron.Right width={14} height={14} /> */}
            </div>
          </div>
          // </Link>
        )}
        <div className={styles.description}>
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
      <div className={styles.productsPreview}>
        <SearchInfo />
        <div className={styles.list}>
          {products.concat(products).map(({ id, ...props }) => (
            <Product
              key={id}
              defaultCurrencySymbol={defaultCurrency.symbol}
              id={id}
              showComponents={false}
              {...props}
            />
          ))}
        </div>
        <div className={styles.ctaContainer + " w100  h100 flex-row-center-flex-end"}>
          <Link href={{ pathname: "/beach/[slug]/products", query: { slug } }}>
            <Button>View products</Button>
          </Link>
        </div>
      </div>
      <Section header="Facilities">
        {/* <BeachBar.Feature.Container style={{ flexDirection: "column", alignItems: "flex-start" }}>
            {sortedFeatures.map(({ quantity, service: { id, name, icon } }) => (
              <Feature key={id} feature={name} quantity={quantity} iconId={icon.publicId} />
            ))}
          </BeachBar.Feature.Container> */}
      </Section>
      <Section header="Contact">
        <div>
          {/* <Section.Contact info="Street address" val={location.address} />
            {location.zipCode && <Section.Contact info="Zip code" val={location.zipCode} />}
            {!hidePhoneNumber && (
              <Section.Contact info="Phone number" val={`+${location.country.callingCode} ${contactPhoneNumber}`} />
            )} */}
        </div>
      </Section>
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

BeachBar.displayName = "BeachBar";

export default BeachBar;
=======
import { BeachBarQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Button } from "@hashtag-design-system/components";
import uniq from "lodash/uniq";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./BeachBar.module.scss";
import { Favourite } from "./Favourite";
import { Feature } from "./Feature";
import { Header } from "./Header";
import { BeachBarHeading } from "./Heading";
import { Img } from "./Img";
import { NameAndLocation } from "./NameAndLocation";
import { Product } from "./Product/Product";
import { Review } from "./Review";
import { Search } from "./Search";
import { SearchInfo } from "./SearchInfo";
import { Section } from "./Section";

const SHRINKED_DESCRIPTION_LENGTH = 720;

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
};

export type Props = {
  reviewScore?: typeof COMMON_CONFIG.DATA.searchFilters.REVIEW_SCORES.EXCELLENT;
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
}) => {
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);

  const { dispatch } = useSearchContext();

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
  const imgsArr = useMemo(
    () => imgUrls.slice(0, 3),
    [imgUrls]
    // .concat(imgUrls.slice(0, 3).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())),
  );
  const reviewsInfo = useMemo(() => {
    const imgUrls = uniq(
      reviews
        .map(({ customer: { user } }) => user?.account.imgUrl || [])
        .flat()
        .slice(0, 3)
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
          <div className={styles.restImgs + " w100 flex-row-flex-start-stretch"}>
            {imgsArr.map(({ id, imgUrl, description }, i) => (
              <Img key={id} src={imgUrl} alt={description && description + " - " + name} layout="fill">
                {i === imgsArr.length - 1 && imgUrls.length > 3 && (
                  <Link href={{ pathname: "/beach/[slug]/photos", query: { slug } }}>
                    <div className={styles.moreImgs + " h100 bold header-5 w100 flex-row-center-center"}>
                      +{imgUrls.length - 3}
                    </div>
                  </Link>
                )}
              </Img>
            ))}
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
                      (i === 0 ? " zi--md" : i === reviewsInfo.imgUrls.length - 1 ? " zi--none " : "") +
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
              {/* <Next.Link href={{ pathname: "/beach/[slug]/reviews", query: { slug } }}>
                <a className="body-14">
                  View {reviews.length > reviewsInfo.length ? "+" : ""}
                  {formatNumber(reviewsInfo.length)} review{reviewsInfo.length > 1 ? "s" : ""}
                </a>
              </Next.Link>
              <Icons.Chevron.Right width={14} height={14} /> */}
            </div>
          </div>
          // </Link>
        )}
        <div className={styles.description}>
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
      <div className={styles.productsPreview}>
        <SearchInfo />
        <div className={styles.list}>
          {products.concat(products).map(({ id, ...props }) => (
            <Product
              key={id}
              defaultCurrencySymbol={defaultCurrency.symbol}
              id={id}
              showComponents={false}
              {...props}
            />
          ))}
        </div>
        <div className={styles.ctaContainer + " w100  h100 flex-row-center-flex-end"}>
          <Link href={{ pathname: "/beach/[slug]/products", query: { slug } }}>
            <Button>View products</Button>
          </Link>
        </div>
      </div>
      <Section header="Facilities">
        {/* <BeachBar.Feature.Container style={{ flexDirection: "column", alignItems: "flex-start" }}>
            {sortedFeatures.map(({ quantity, service: { id, name, icon } }) => (
              <Feature key={id} feature={name} quantity={quantity} iconId={icon.publicId} />
            ))}
          </BeachBar.Feature.Container> */}
      </Section>
      <Section header="Contact">
        <div>
          {/* <Section.Contact info="Street address" val={location.address} />
            {location.zipCode && <Section.Contact info="Zip code" val={location.zipCode} />}
            {!hidePhoneNumber && (
              <Section.Contact info="Phone number" val={`+${location.country.callingCode} ${contactPhoneNumber}`} />
            )} */}
        </div>
      </Section>
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

BeachBar.displayName = "BeachBar";

export default BeachBar;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
