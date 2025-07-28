import { defaultEdgeTooltip } from './constant';
import { GraphEdgeTooltip } from './types';
import { Dispatch, SetStateAction, useState } from 'react';
import OllamaFlowSpace from '@/components/base/space/Space';
import OllamaFlowCard from '@/components/base/card/Card';
import { CloseCircleFilled, CopyOutlined, ExpandOutlined, LoadingOutlined } from '@ant-design/icons';
import FallBack from '@/components/base/fallback/FallBack';
import PageLoading from '@/components/base/loading/PageLoading';
import OllamaFlowFlex from '@/components/base/flex/Flex';
import OllamaFlowText from '@/components/base/typograpghy/Text';
import OllamaFlowButton from '@/components/base/button/Button';
import AddEditEdge from '@/page/edges/components/AddEditEdge';
import { EdgeType } from '@/types/types';
import DeleteEdge from '@/page/edges/components/DeleteEdge';
import OllamaFlowTooltip from '@/components/base/tooltip/Tooltip';
import { JsonEditor } from 'jsoneditor-react';
import styles from './tooltip.module.scss';
import classNames from 'classnames';
import { useGetEdgeByIdQuery, useGetGraphGexfContentQuery, useGetManyNodesQuery } from '@/lib/store/slice/slice';
import { copyTextToClipboard } from '@/utils/jsonCopyUtils';

type EdgeTooltipProps = {
  tooltip: GraphEdgeTooltip;
  setTooltip: Dispatch<SetStateAction<GraphEdgeTooltip>>;
  graphId: string;
};

const EdgeToolTip = ({ tooltip, setTooltip, graphId }: EdgeTooltipProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // State for AddEditDeleteNode visibility and selected node
  const [isAddEditEdgeVisible, setIsAddEditEdgeVisible] = useState<boolean>(false);
  const [isDeleteModelVisisble, setIsDeleteModelVisisble] = useState<boolean>(false);
  const [selectedEdge, setSelectedEdge] = useState<EdgeType | null | undefined>(undefined);

  const {
    data: edge,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetEdgeByIdQuery({
    graphId,
    edgeId: tooltip.edgeId,
    request: { includeSubordinates: true },
  });
  // const { refetch: fetchGexfByGraphId } = useGetGraphGexfContentQuery(graphId);
  const nodeIds = [edge?.From, edge?.To].filter(Boolean) as string[];
  const {
    data: nodesList,
    isLoading: isNodesLoading,
    isFetching: isNodesFetching,
  } = useGetManyNodesQuery({ graphId, nodeIds }, { skip: !nodeIds.length });
  const isNodesLoadingOrFetching = isNodesLoading || isNodesFetching;
  const fromNode = nodesList?.find((node) => node.GUID === edge?.From);
  const toNode = nodesList?.find((node) => node.GUID === edge?.To);
  // Callback for handling edge update
  const handleEdgeUpdate = async () => {
    if (graphId && tooltip.edgeId) {
      // await fetchGexfByGraphId();
    }
  };

  // Callback for handling edge deletion
  const handleEdgeDelete = async () => {
    // await fetchGexfByGraphId();

    // Clear the tooltip after deletion
    setTooltip(defaultEdgeTooltip);
  };

  return (
    <>
      <OllamaFlowSpace
        direction="vertical"
        size={16}
        className={classNames(styles.tooltipContainer)}
        style={{
          top: tooltip.y,
          left: tooltip.x,
        }}
      >
        <OllamaFlowCard
          title={
            <OllamaFlowText weight={600} fontSize={18}>
              Edge Information
            </OllamaFlowText>
          }
          extra={
            <OllamaFlowFlex gap={10}>
              <OllamaFlowTooltip title="Expand" placement="bottom">
                <ExpandOutlined
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedEdge(edge);
                    setIsExpanded(true);
                    setIsAddEditEdgeVisible(true);
                  }}
                />
              </OllamaFlowTooltip>
              <CloseCircleFilled className="cursor-pointer" onClick={() => setTooltip(defaultEdgeTooltip)} />
            </OllamaFlowFlex>
          }
          style={{ width: 300 }}
        >
          {/* If error then fallback displays */}
          {isLoading || isFetching ? (
            // If not error but API is in loading state then dispalys loader
            <PageLoading withoutWhiteBG />
          ) : error ? (
            <FallBack retry={refetch}>{error ? 'Something went wrong.' : "Can't view details at the moment."}</FallBack>
          ) : (
            // Ready to show data after API is ready
            <OllamaFlowFlex vertical>
              <OllamaFlowFlex vertical className="card-details">
                <OllamaFlowText data-testid="edge-guid">
                  <strong>GUID: </strong>
                  {edge?.GUID}{' '}
                  <CopyOutlined
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      copyTextToClipboard(edge?.GUID || '', 'GUID');
                    }}
                  />
                </OllamaFlowText>
                <OllamaFlowText>
                  <strong>Name: </strong>
                  {edge?.Name}
                </OllamaFlowText>

                <OllamaFlowText>
                  <strong>From: </strong>
                  {isNodesLoadingOrFetching ? <LoadingOutlined /> : fromNode?.Name}
                </OllamaFlowText>

                <OllamaFlowText>
                  <strong>To: </strong>
                  {isNodesLoadingOrFetching ? <LoadingOutlined /> : toNode?.Name}
                </OllamaFlowText>

                <OllamaFlowText>
                  <strong>Cost: </strong>
                  {edge?.Cost}
                </OllamaFlowText>

                <OllamaFlowText>
                  <strong>Labels: </strong>
                  {`${edge?.Labels?.length ? edge?.Labels?.join(', ') : 'None'}`}
                </OllamaFlowText>

                {/* <OllamaFlowText>
                  <strong>Vectors: </strong>
                  {pluralize(edge?.Vectors?.length || 0, 'vector')}
                </OllamaFlowText> */}

                <OllamaFlowText>
                  <strong>Tags: </strong>
                  {Object.keys(edge?.Tags || {}).length > 0 ? (
                    <JsonEditor
                      key={JSON.stringify(edge?.Tags && JSON.parse(JSON.stringify(edge.Tags)))}
                      value={(edge?.Tags && JSON.parse(JSON.stringify(edge.Tags))) || {}}
                      mode="view" // Use 'view' mode to make it read-only
                      mainMenuBar={false} // Hide the menu bar
                      statusBar={false} // Hide the status bar
                      navigationBar={false} // Hide the navigation bar
                      enableSort={false}
                      enableTransform={false}
                    />
                  ) : (
                    <OllamaFlowText>None</OllamaFlowText>
                  )}
                </OllamaFlowText>
                {/* 
                <OllamaFlowFlex align="center" gap={6}>
                  <OllamaFlowText>
                    <strong>Data:</strong>
                  </OllamaFlowText>
                  <OllamaFlowTooltip title="Copy JSON">
                    <CopyOutlined
                      className="cursor-pointer"
                      onClick={() => {
                        copyJsonToClipboard(edge?.Data || {}, 'Data');
                      }}
                    />
                  </OllamaFlowTooltip>
                </OllamaFlowFlex>
                <JsonEditor
                  key={JSON.stringify(edge?.Data && JSON.parse(JSON.stringify(edge?.Data)))}
                  value={(edge?.Data && JSON.parse(JSON.stringify(edge.Data))) || {}}
                  mode="view" // Use 'view' mode to make it read-only
                  mainMenuBar={false} // Hide the menu bar
                  statusBar={false} // Hide the status bar
                  navigationBar={false} // Hide the navigation bar
                  enableSort={false}
                  enableTransform={false}
                /> */}
              </OllamaFlowFlex>

              {/* Buttons */}
              <OllamaFlowFlex justify="space-between" gap={10} className="pt-3">
                <OllamaFlowTooltip title={'Update Edge'} placement="bottom">
                  <OllamaFlowButton
                    type="link"
                    onClick={() => {
                      setSelectedEdge(edge);
                      setIsAddEditEdgeVisible(true);
                    }}
                  >
                    Update
                  </OllamaFlowButton>
                </OllamaFlowTooltip>
                <OllamaFlowTooltip title={'Delete Edge'} placement="bottom">
                  <OllamaFlowButton
                    type="link"
                    onClick={() => {
                      setSelectedEdge(edge);
                      setIsDeleteModelVisisble(true);
                    }}
                  >
                    Delete
                  </OllamaFlowButton>
                </OllamaFlowTooltip>
              </OllamaFlowFlex>
            </OllamaFlowFlex>
          )}
        </OllamaFlowCard>
      </OllamaFlowSpace>

      {/* AddEditEdge Component On Update*/}
      {selectedEdge && (
        <AddEditEdge
          isAddEditEdgeVisible={isAddEditEdgeVisible}
          setIsAddEditEdgeVisible={setIsAddEditEdgeVisible}
          edge={selectedEdge || null}
          selectedGraph={graphId}
          onEdgeUpdated={handleEdgeUpdate} // Pass callback to handle updates
          readonly={isExpanded}
          onClose={() => {
            setIsAddEditEdgeVisible(false);
            setSelectedEdge(null);
            setIsExpanded(false);
          }}
        />
      )}

      {/* DeleteEdge Component On Delete*/}
      <DeleteEdge
        title={`Are you sure you want to delete "${selectedEdge?.Name}" edge?`}
        paragraphText={'This action will delete edge.'}
        isDeleteModelVisisble={isDeleteModelVisisble}
        setIsDeleteModelVisisble={setIsDeleteModelVisisble}
        selectedEdge={selectedEdge}
        setSelectedEdge={setSelectedEdge}
        onEdgeDeleted={handleEdgeDelete}
      />
    </>
  );
};

export default EdgeToolTip;
