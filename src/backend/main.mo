import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type PostAnalytics = {
    likes : Nat;
    comments : Nat;
    shares : Nat;
    reach : Nat;
    engagementRate : Float;
  };

  type Post = {
    id : Nat;
    owner : Principal;
    idea : Text;
    platform : Text; // "instagram", "facebook", "both"
    status : Text; // "draft", "pending_approval", "approved", "scheduled", "published", "rejected"
    selectedCaption : Text;
    optimizedCaption : Text;
    hashtags : [Text];
    scheduledAt : ?Text;
    createdAt : Int;
    analytics : PostAnalytics;
  };

  public type UserProfile = {
    name : Text;
  };

  module Post {
    public func compare(post1 : Post, post2 : Post) : Order.Order {
      Nat.compare(post1.id, post2.id);
    };
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let posts = Map.empty<Nat, Post>();
  let availableIds = List.empty<Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to check post ownership
  func isPostOwnerOrAdmin(caller : Principal, post : Post) : Bool {
    caller == post.owner or AccessControl.isAdmin(accessControlState, caller);
  };

  // Post Functions
  public shared ({ caller }) func createPost(idea : Text, platform : Text) : async Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let id = switch (availableIds.last()) {
      case (?reusedId) {
        ignore availableIds.removeLast();
        reusedId;
      };
      case (_) {
        let currentId = nextId;
        nextId += 1;
        currentId;
      };
    };

    let post : Post = {
      id;
      owner = caller;
      idea;
      platform;
      status = "draft";
      selectedCaption = "";
      optimizedCaption = "";
      hashtags = [];
      scheduledAt = null;
      createdAt = Time.now();
      analytics = {
        likes = 0;
        comments = 0;
        shares = 0;
        reach = 0;
        engagementRate = 0.0;
      };
    };
    posts.add(id, post);
    post;
  };

  public query ({ caller }) func getPosts() : async [Post] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.values().toArray().sort();
  };

  public query ({ caller }) func getPost(id : Nat) : async ?Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.get(id);
  };

  public shared ({ caller }) func updatePostStatus(id : Nat, status : Text) : async ?Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };

    switch (posts.get(id)) {
      case (?post) {
        if (not isPostOwnerOrAdmin(caller, post)) {
          Runtime.trap("Unauthorized: You can only update your own posts");
        };
        let updatedPost = { post with status };
        posts.add(id, updatedPost);
        ?updatedPost;
      };
      case (_) { null };
    };
  };

  public shared ({ caller }) func updatePostCaption(id : Nat, caption : Text) : async ?Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };

    switch (posts.get(id)) {
      case (?post) {
        if (not isPostOwnerOrAdmin(caller, post)) {
          Runtime.trap("Unauthorized: You can only update your own posts");
        };
        let updatedPost = { post with selectedCaption = caption };
        posts.add(id, updatedPost);
        ?updatedPost;
      };
      case (_) { null };
    };
  };

  public shared ({ caller }) func updatePostHashtags(id : Nat, hashtags : [Text]) : async ?Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };

    switch (posts.get(id)) {
      case (?post) {
        if (not isPostOwnerOrAdmin(caller, post)) {
          Runtime.trap("Unauthorized: You can only update your own posts");
        };
        let updatedPost = { post with hashtags };
        posts.add(id, updatedPost);
        ?updatedPost;
      };
      case (_) { null };
    };
  };

  public shared ({ caller }) func schedulePost(id : Nat, scheduledAt : Text) : async ?Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can schedule posts");
    };

    switch (posts.get(id)) {
      case (?post) {
        if (not isPostOwnerOrAdmin(caller, post)) {
          Runtime.trap("Unauthorized: You can only schedule your own posts");
        };
        let updatedPost = { post with scheduledAt = ?scheduledAt; status = "scheduled" };
        posts.add(id, updatedPost);
        ?updatedPost;
      };
      case (_) { null };
    };
  };

  public shared ({ caller }) func updateAnalytics(id : Nat, likes : Nat, comments : Nat, shares : Nat, reach : Nat, engagementRate : Float) : async ?Post {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update analytics");
    };

    switch (posts.get(id)) {
      case (?post) {
        let updatedAnalytics = {
          likes;
          comments;
          shares;
          reach;
          engagementRate;
        };
        let updatedPost = { post with analytics = updatedAnalytics };
        posts.add(id, updatedPost);
        ?updatedPost;
      };
      case (_) { null };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };

    switch (posts.get(id)) {
      case (?post) {
        if (not isPostOwnerOrAdmin(caller, post)) {
          Runtime.trap("Unauthorized: You can only delete your own posts");
        };
        posts.remove(id);
        availableIds.add(id);
        true;
      };
      case (_) { false };
    };
  };

  public query ({ caller }) func getDashboardStats() : async { totalPosts : Nat; scheduled : Nat; published : Nat; avgEngagement : Float } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

    var totalPosts = 0;
    var scheduled = 0;
    var published = 0;
    var totalEngagement = 0.0;
    var engagementCount = 0;

    for (post in posts.values()) {
      totalPosts += 1;
      if (post.status == "scheduled") {
        scheduled += 1;
      };
      if (post.status == "published") {
        published += 1;
        totalEngagement += post.analytics.engagementRate;
        engagementCount += 1;
      };
    };

    let avgEngagement = if (engagementCount > 0) {
      totalEngagement / engagementCount.toFloat();
    } else {
      0.0;
    };

    {
      totalPosts;
      scheduled;
      published;
      avgEngagement;
    };
  };
};
