// module.exports.connectionio = function (socket_io) {
//     socket_io.on('news', function (newsreel) {
//         socket.broadcast.emit(newsreel);
//     });
    // Returning the initial data of food menu from FoodItems collection
    // socket.on("initial_data", () => {
    //     collection_foodItems.find({}).then(docs => {
    //         io.sockets.emit("get_data", docs);
    //     });
    // });
    // // Placing the order, gets called from /src/main/PlaceOrder.js of Frontend
    // socket.on("putOrder", order => {
    //     collection_foodItems
    //         .update({ _id: order._id }, { $inc: { ordQty: order.order } })
    //         .then(updatedDoc => {
    //             // Emitting event to update the Kitchen opened across the devices with the realtime order values
    //             io.sockets.emit("change_data");
    //         });
    // });
    // // Order completion, gets called from /src/main/Kitchen.js
    // socket.on("mark_done", id => {
    //     collection_foodItems
    //         .update({ _id: id }, { $inc: { ordQty: -1, prodQty: 1 } })
    //         .then(updatedDoc => {
    //             //Updating the different Kitchen area with the current Status.
    //             io.sockets.emit("change_data");
    //         });
    // });

    // // Functionality to change the predicted quantity value, called from /src/main/UpdatePredicted.js
    // socket.on("ChangePred", predicted_data => {
    //     collection_foodItems
    //         .update(
    //             { _id: predicted_data._id },
    //             { $set: { predQty: predicted_data.predQty } }
    //         )
    //         .then(updatedDoc => {
    //             // Socket event to update the Predicted quantity across the Kitchen
    //             io.sockets.emit("change_data");
    //         });
    // });
    // disconnect is fired when a client leaves the server
//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     });
// };

