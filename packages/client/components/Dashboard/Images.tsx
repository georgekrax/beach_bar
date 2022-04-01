import BeachBar from "@/components/BeachBar";
import Dashboard from "@/components/Dashboard";
import Icons from "@/components/Icons";
import Next from "@/components/Next";
import {
  BeachBarDocument,
  BeachBarQuery,
  useAddBeachBarImgUrlMutation,
  useDeleteBeachBarImgUrlMutation,
  useUpdateBeachBarImgUrlMutation,
} from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Button, Input } from "@hashtag-design-system/components";
import { useMemo } from "react";
import styles from "./Images.module.scss";

export const Images: React.FC = () => {
  const { beachBar, loading } = useDashboard({ fetch: true });

  const [addImg] = useAddBeachBarImgUrlMutation();
  const [updateImg] = useUpdateBeachBarImgUrlMutation();
  const [deleteImg] = useDeleteBeachBarImgUrlMutation();

  const name = beachBar?.name;
  const imgsArr = useMemo(
    () =>
      Array.from(beachBar?.imgUrls || []).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [beachBar?.imgUrls]
  );

  const handleNew = async (imgUrl: string) => {
    if (!beachBar) return notify("error", "");
    const{ id: beachBarId } = beachBar;
    const { data, errors } = await addImg({
      variables: {
        beachBarId,
        imgUrl,
        // "https://images.unsplash.com/photo-1600541205201-ee96f8c639f8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80",
        description: undefined,
      },
      update: (cache, { data }) => {
        if (!data?.addBeachBarImgUrl) return;
        cache.writeQuery<BeachBarQuery>({
          query: BeachBarDocument,
          variables: { id: beachBarId, slug: undefined, userVisit: false },
          data: {
            __typename: "Query",
            beachBar: { ...beachBar, imgUrls: [...beachBar.imgUrls, data.addBeachBarImgUrl] },
          },
        });
      },
    });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message));
    else notify("success", "Image added!");
  };

  const handleUpdate = async (e: React.FocusEvent<HTMLInputElement>, id: string) => {
    const newDescription = e.target.value;
    const item = imgsArr.find(img => img.id === id);
    if ((item && item.description) || "" === newDescription) return;
    const { data, errors } = await updateImg({ variables: { id, description: newDescription } });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message));
  };

  const handleDelete = async (id: string) => {
    if (!beachBar) return notify("error", "");
    const { data, errors } = await deleteImg({
      variables: { id },
      update: cache => {
        cache.writeQuery<BeachBarQuery>({
          query: BeachBarDocument,
          variables: { id: beachBar.id, slug: undefined, userVisit: false },
          data: {
            __typename: "Query",
            beachBar: { ...beachBar, imgUrls: beachBar.imgUrls.filter(img => img.id !== id) },
          },
        });
      },
    });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message));
    else notify("success", "Image deleted.");
  };

  return (
    <div>
      <Dashboard.AddBtn
        isUpload
        heading="Images"
        onChange={async ({ s3Url }) => {
          if (s3Url) await handleNew(s3Url);
        }}
      />
      <div className={styles.list + " flex-row-flex-start-flex-start flex--wrap"}>
        <Next.Loading isScreen isLoading={loading}>
          {imgsArr.length === 0 ? (
            <Next.DoNotHave
              emoji="😔"
              msg="You have not added any images (except from the thumbnail) to your #beach_bar."
            />
          ) : (
            <>
              {imgsArr?.map(({ id, imgUrl, description }, i) => {
                const isLast = i === imgsArr.length - 1;
                return (
                  <div key={"img_" + id} className={styles.img}>
                    <BeachBar.Img
                      src={imgUrl}
                      layout="fill"
                      isLast={isLast}
                      description={description}
                      alt={description ? description + " - " + name : name?.trimEnd() + "'s image"}
                    />
                    <span className="body-12 text--grey d--block">&#35;{i + 1}</span>
                    <div className={styles.edit + " flex-row-flex-start-center"}>
                      <Input
                        placeholder="Description"
                        defaultValue={description}
                        onBlur={async e => await handleUpdate(e, id)}
                      />
                      <Button
                        variant="secondary"
                        className={styles.deleteBtn}
                        onClick={async () => await handleDelete(id)}
                      >
                        <Icons.TrashBin width={14} height={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Next.Loading>
      </div>
      {/* {loading ? (
        <div className="spinner spinner--screen w100 h100 flex-row-center-center">
          <Animated.Loading.Spinner />
        </div>
      ) : imgsArr.length === 0 ? (
        <Next.DoNotHave
          emoji="😔"
          msg="You have not added any images (except from the thumbnail) to your #beach_bar."
        />
      ) : (
        <div className={styles.list + " flex-row-flex-start-flex-start flex--wrap"}>
          {imgsArr?.map(({ id, imgUrl, description }, i) => {
            const isLast = i === imgsArr.length - 1;
            return (
              <div key={"img_" + id} className={styles.img}>
                <BeachBar.Img
                  src={imgUrl}
                  layout="fill"
                  isLast={isLast}
                  description={description}
                  alt={description ? description + " - " + name : name?.trimEnd() + "'s image"}
                />
                <span className="body-12 text--grey d--block">&#35;{i + 1}</span>
                <div className={styles.edit + " flex-row-flex-start-center"}>
                  <Input
                    placeholder="Description"
                    defaultValue={description}
                    onBlur={async e => await handleUpdate(e, id)}
                  />
                  <Button variant="secondary" className={styles.deleteBtn} onClick={async () => await handleDelete(id)}>
                    <Icons.TrashBin width={14} height={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
};

Images.displayName = "DashboardImages";
