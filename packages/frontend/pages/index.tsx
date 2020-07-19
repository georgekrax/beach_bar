import { Button, Col, Row } from "antd";
import { InferGetStaticPropsType } from "next";
import React from "react";
import { fetchQuery, graphql } from "react-relay";
import DatePicker from "../components/DatePicker";
import Product from "../components/Product";
import { pages_indexQueryResponse, pages_indexQueryVariables } from "../generated/pages_indexQuery.graphql";
import { initEnvironment } from "../lib/createEnvironment";
import css from "../public/static/index.module.scss";

const query = graphql`
  query pages_indexQuery {
    getBeachBarProducts(beachBarId: 2) {
      name
      category {
        name
      }
    }
  }
`;

export const Index: any = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log({ css });
  return (
    <div style={{ marginTop: 50 }}>
      <Row>
        <Col offset={2} span={20}>
          <p className={css.hey}>Hello world!</p>
          <Button>Click me!</Button>
          <DatePicker picker="date" onChange={date => console.log(date)} />
          {props.data.getBeachBarProducts &&
            props.data.getBeachBarProducts.map(product => <Product key={product.name} product={product} />)}
        </Col>
      </Row>
    </div>
  );
};

export const getStaticProps = async (): Promise<{ props: { data: pages_indexQueryResponse } }> => {
  const { environment } = initEnvironment();
  const variables: pages_indexQueryVariables = {
    beachBarId: 2,
  };
  const res = (await fetchQuery(environment, query, variables)) as pages_indexQueryResponse;
  if (res) {
    return {
      props: { data: res },
    };
  } else {
    return {
      props: {
        data: null,
      },
    };
  }
};

export default Index;
