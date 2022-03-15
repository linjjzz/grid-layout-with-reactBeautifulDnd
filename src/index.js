import React, { Component } from "react";
import ReactDOM from "react-dom";
import uuid from "uuid/v4";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  sourceClone.forEach((item, index) => {
    item.w = 2;
    item.h = 1;
    item.x = 0;
    item.y = 0;
    item.i = index;
  });
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const Content = styled.div`
  margin-right: 200px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  border-radius: 3px;
  background: #fff;
  overflow: hidden;
  /* background: ${props => (props.isDragging ? "red" : "blue")}; */
  border: 1px ${props => (props.isDragging ? "dashed #000" : "solid #ddd")};
`;

const ItemDropped = styled(Item)`
  line-height: calc(75%);
  @media (max-width: 768px) {
    font-size: 8px;
    text-align: left;
  }
`;

const Clone = styled(Item)`
  + div {
    display: none !important;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 200px;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

const ITEMS = [
  {
    id: uuid(),
    content: "Headline"
  },
  {
    id: uuid(),
    content: "Copy"
  },
  {
    id: uuid(),
    content: "Image"
  },
  {
    id: uuid(),
    content: "Slideshow"
  },
  {
    id: uuid(),
    content: "Quote"
  }
];

class App extends Component {
  state = {
    [uuid()]: []
  };
  static defaultProps = {
    className: "layout",
    // items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };
  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        this.setState({
          [destination.droppableId]: reorder(
            this.state[source.droppableId],
            source.index,
            destination.index
          )
        });
        break;
      case "ITEMS":
        this.setState({
          [destination.droppableId]: copy(
            ITEMS,
            this.state[destination.droppableId],
            source,
            destination
          )
        });
        break;
      default:
        this.setState(
          move(
            this.state[source.droppableId],
            this.state[destination.droppableId],
            source,
            destination
          )
        );
        break;
    }
  };

  addList = e => {
    this.setState({ [uuid()]: [] });
  };

  onLayoutChange(layout) {
    console.log("onLayoutChangeonLayoutChangeonLayoutChange", layout);
    this.props.onLayoutChange(layout);
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    console.log(this.state.itemHt, "itemHtitemHtitemHt");
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="ITEMS" isDropDisabled={true}>
          {(provided, snapshot) => (
            <Kiosk
              innerRef={provided.innerRef}
              className="kioskkkkkkkk"
              isDraggingOver={snapshot.isDraggingOver}
            >
              {ITEMS.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <React.Fragment>
                      <Item
                        className="item"
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        style={provided.draggableProps.style}
                      >
                        {item.content}
                      </Item>
                      {snapshot.isDragging && (
                        <Clone className="clone">{item.content}</Clone>
                      )}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
            </Kiosk>
          )}
        </Droppable>
        <Content className="content DashPreview-PreviewList">
          <Button onClick={this.addList}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              />
            </svg>
            <ButtonText>Add List</ButtonText>
          </Button>
          {Object.keys(this.state).map((list, i) => (
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <Container
                  innerRef={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <ReactGridLayout
                    key={"gridlayout"}
                    isResizable={false}
                    style={{ overflow: "auto" }}
                    onLayoutChange={this.onLayoutChange.bind(this)}
                    // preventCollision
                    {...this.props}
                  >
                    {this.state[list].length ? (
                      this.state[list].map((item, index) => (
                        <ItemDropped
                          key={"item" + index}
                          data-grid={{
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h
                          }}
                        >
                          {item.content}
                        </ItemDropped>
                      ))
                    ) : (
                      <Notice>Drop items here</Notice>
                    )}
                  </ReactGridLayout>
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          ))}
        </Content>
      </DragDropContext>
    );
  }
}

// Put the things into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
