#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;



@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class getGraphInfo extends HutongGames.PlayMaker.FsmStateAction{
		
		@Tooltip("Choose the right type of graph. Choosing Any works on any graph, but choosing the wrong one will return nothing.")	
		public var graphType : GraphType;
		
		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNavGraph))
		@Tooltip("The graph")	
		public var graph : FsmObject;
		
		
		
		@ActionSection ("Output - GameObjects")

		@Tooltip("Childs of this transform are treated as nodes. ")	
		public var root : FsmGameObject;
		
		@ActionSection ("Output - Layermasks")
        @UIHint(UIHint.Layer)
        @Tooltip("Pick only from these layers in the raycast check")
        public var mask : FsmInt;
		
		@ActionSection("Vector3")
		@Tooltip("	Max distance along the axis for a connection to be valid. ")	
		public var limits : FsmVector3;
		
		@ActionSection ("Vector2")	
		@Tooltip("	Size of the grid. ")		
		public var size : FsmVector2;
		
		@ActionSection("Output - Strings")
		@Tooltip("Returns unique ID of this graph")	
		public var guid : FsmString;
		
		@ActionSection ("Bools")
		@Tooltip("draw general graph gizmos? Like nodes etc?")	
		public var drawGizmos : FsmBool;
		
		@Tooltip("Used in the editor to check if the info screen is open. ")	
		public var infoScreenOpen : FsmBool;
		
		@Tooltip("	Is the graph open in the editor ")
		public var open : FsmBool;

		public var autoLinkNodes : FsmBool;
		
		@Tooltip("Use raycasts to check connections. ")
		public var raycast : FsmBool;

		@Tooltip("Recursively search for childnodes to the root. ")
		public var recursive : FsmBool;
		
		@Tooltip("Use thick raycast. ")
		public var thickRaycast : FsmBool;
		
		@ActionSection ("Ints")		
		@Tooltip("Used in the editor to check if the info screen is open. ")	
		public var initialPenalty : FsmInt;
		
		@Tooltip("	In GetNearestForce, determines how far to search after a valid node has been found. ")	
		public var getNearestForceOverlap : FsmInt;

		public var scans : FsmInt;
		
		@ActionSection ("Floats")		
		public var thickRaycastRadius : FsmFloat;
		
		@Tooltip("Max distance for a connection to be valid. ")
		public var maxDistance : FsmFloat;
		
		@ActionSection ("Strings")
		public var name : FsmString;
		
		@Tooltip("If no root is set, all nodes with the tag is used as nodes. ")
		public var searchTag : FsmString;
		
		@ActionSection ("Nodes...s")
		@Tooltip("All nodes this graph contains. They are not the same type as the nodes from the path, though they are extensions")
		@ObjectType(typeof(FsmNodes))
		public var nodes : FsmObject;
		
		public var everyFrame : FsmBool;
		
		private var g : NavGraph;
      
	  
		public enum GraphType{
		any,
		pointGraph,
		gridGraph,
		all,
		}
		
		public function Reset(){
		graph = null;
		guid = null;
	
		}
		
		public function OnEnter() 
	  	{
			
			DoStuff();
			
			if (!everyFrame.Value)
			Finish();

			
		}
	  
		public function DoStuff(){

			var go : FsmNavGraph = graph.Value as FsmNavGraph;
			if(go.Value == null) {Finish(); return;}
			
			
			g = GetNavGraph(graph);
			
			guid.Value = g.guid.ToString();
			drawGizmos.Value = g.drawGizmos;
			infoScreenOpen.Value = g.infoScreenOpen;
			initialPenalty.Value = g.initialPenalty;
			name.Value = g.name;

			nodes.Value = SetNodes(NodeListToArray(g.nodes)) as FsmNodes;  // everywhere else it's saved as a generic list, only here it is an array, so it needs extra conversion
			open.Value = g.open;
			
			if(graphType == GraphType.pointGraph && g as PointGraph != null){
				autoLinkNodes.Value = (g as PointGraph).autoLinkNodes ;
				limits.Value = (g as PointGraph).limits ;
				mask.Value =  (g as PointGraph).mask ;
				maxDistance.Value = (g as PointGraph).maxDistance ;
				raycast.Value = (g as PointGraph).raycast ;
				recursive.Value = (g as PointGraph).recursive ;
				root.Value = (g as PointGraph).root.gameObject ;
				searchTag.Value = (g as PointGraph).searchTag ;
				thickRaycast.Value = (g as PointGraph).thickRaycast ;
				thickRaycastRadius.Value = (g as PointGraph).thickRaycastRadius ;
			}
			
			if(graphType == GraphType.gridGraph && g as GridGraph != null){
				getNearestForceOverlap.Value = (g as GridGraph).getNearestForceOverlap ;
				scans.Value = (g as GridGraph).scans ;
				size.Value = (g as GridGraph).size;
			}

		}

		
		public function OnUpdate()
		{
			DoStuff();
		}
	  
   	}
	


