#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import AstarPathExtension;


@ActionCategory("A Star")
@Tooltip("recursively checks all children of a gameObject and adds their positions to a PointGraph. It then connects every node to surrounding nodes based on the max distance value. It's called complex because it creates a complex graph without any real order, and nodes can have all number of connections.")


public class ComplexPointGraphFromChildren extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNavGraph))
		@Tooltip("The point graph. Both input and output. But the variable does not actually need to contain a root yet, if there is none it will always create a new one. It just needs somewhere to save it then, which is why this is required.")	
		public var graph : FsmObject;
		
		@Tooltip("You can give this graph whatever name you want. If you want to get it by its' name lateron thouh, make sure that the name is unique.")	
      	public var name : FsmString;   			
		
			
		@RequiredField
		@Tooltip("The root of the gameObjects you want to use as a graph")	
      	public var gameObject : FsmOwnerDefault;   
		
		@Tooltip("How easy are the nodes to walk over? If it's a path through the swamp, then you may want to turn this up. Movement actions also have the option to move more slowly on nodes with high cost, and astar generally avoids them unless the cost is less than the cost of the additional nodes needed to go around them (in this case going around the swamp) would take.")	
		public var cost : FsmInt;
		
		@Tooltip("If the distance between 2 nodes is less than this, they will be connected")	
		public var maxDistance : FsmFloat;
		
		@Tooltip("Check this to connect the graph nodes to any node from a different graph, if those nodes are closer than the Max Distance")
		public var connect : FsmBool;
		
		@ActionSection ("Output : Nodes...s")
		
		@Tooltip("If you're using a grid graph, this will be what you need.")
		@ObjectType(typeof(FsmNodes))
		public var Nodes : FsmObject;
		
		@Tooltip("If true, this always creates a new PointGraph. If False, this adds to the current PointGraph in the graph variable.")
		public var alwaysNew : FsmBool;
		
		private var g : PointGraph;
		private var nnc : NNConstraint;
		private var mo : FsmNavGraph;
	  
		public function Reset(){
		graph = null;
		maxDistance = 1.5f;
	
		}
		
		public function OnEnter() 
	  	{
			mo = graph.Value as FsmNavGraph;
			//Debug.Log(typeof(mo));
			if ((typeof(mo) == null) ||(mo.Value == null) || alwaysNew.Value) {
				g =  AstarPath.active.astarData.AddGraph(PointGraph) as PointGraph;
				Debug.Log ("Creating New Point Graph");
				
				graph.Value = SetNavGraph(g as NavGraph);
			} // create a PointGraph if the variable does not contain a valid one already.
			else {
				g = GetNavGraph(graph) as PointGraph;
			}
			
			DoStuff();
			

			Finish();

			
		}
		
		public function DoStuff(){
		 	var go = gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value;
		 	
		 	g.root = go.transform; // set the root so the scan will turn it into nodes
		 	g.maxDistance = maxDistance.Value; // set max distance for connection
			g.initialPenalty = cost.Value;
			g.name = name.Value;
		 	AstarPathExtensions.ScanGraph (g); // turn the gameObjects into ndoes.
			
			Nodes.Value = SetNodes(NodeListToArray(g.nodes));

			//Required since the graph connections have been updated
			AstarPath.active.FloodFill ();

			return;

		}
		
	  
   	}
	


