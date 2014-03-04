#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("set all kinds of variables in aany kind of graph, or choose a specific type of graph to set variables unique to that graphtype")


public class setGraphInfo extends HutongGames.PlayMaker.FsmStateAction{
		
		@Tooltip("Choose the right type of graph. Choosing Any works on any graph, but choosing the wrong one will return nothing.")	
		public var graphType : GraphType;
		
		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNavGraph))
		@Tooltip("The graph")	
		public var graph : FsmObject;
		
        @UIHint(UIHint.Layer)
        @Tooltip("Pick only from these layers in the raycast check")
        public var mask : FsmInt;
		
		@Tooltip("	Max distance along the axis for a connection to be valid. ")	
		public var limits : FsmVector3;
			
		@Tooltip("	Size of the grid. ")
		public var size : FsmVector2;
		
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
				
		@Tooltip("Used in the editor to check if the info screen is open. ")	
		public var initialPenalty : FsmInt;
		
		@Tooltip("	In GetNearestForce, determines how far to search after a valid node has been found. ")	
		public var getNearestForceOverlap : FsmInt;

		public var scans : FsmInt;
			
		public var thickRaycastRadius : FsmFloat;
		
		@Tooltip("Max distance for a connection to be valid. ")
		public var maxDistance : FsmFloat;
		
		public var name : FsmString;
		
		@Tooltip("If no root is set, all nodes with the tag is used as nodes. ")
		public var searchTag : FsmString;
		
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
			mask = FsmInt(); mask.UseVariable = true;
			limits = FsmVector3(); limits.UseVariable = true;
			size = FsmVector2(); size.UseVariable = true;
			drawGizmos = FsmBool(); drawGizmos.UseVariable = true;
			infoScreenOpen = FsmBool(); infoScreenOpen.UseVariable = true;
			open = FsmBool(); open.UseVariable = true;
			autoLinkNodes = FsmBool(); autoLinkNodes.UseVariable = true;
			raycast = FsmBool(); raycast.UseVariable = true;
			recursive = FsmBool(); recursive.UseVariable = true;
			thickRaycast = FsmBool(); thickRaycast.UseVariable = true;
			initialPenalty = FsmInt(); initialPenalty.UseVariable = true;
			getNearestForceOverlap = FsmInt(); getNearestForceOverlap.UseVariable = true;
			scans = FsmInt(); scans.UseVariable = true;
			thickRaycastRadius = FsmFloat(); thickRaycastRadius.UseVariable = true;
			maxDistance = FsmFloat(); maxDistance.UseVariable = true;
			name = FsmString(); name.UseVariable = true;
			searchTag = FsmString(); searchTag.UseVariable = true;
			nodes = FsmObject(); nodes.UseVariable = true;
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
			
			if (!drawGizmos.IsNone)
			g.drawGizmos = drawGizmos.Value;
			if (!infoScreenOpen.IsNone)
			g.infoScreenOpen = infoScreenOpen.Value;
			if (!initialPenalty.IsNone)
			g.initialPenalty = initialPenalty.Value;
			if (!name.IsNone)
			g.name = name.Value;
			if (!nodes.IsNone)
			g.nodes = NodeArrayFromList((nodes.Value as FsmNodes).Value);
			if (!open.IsNone)
			g.open = open.Value;
			
			if(graphType == GraphType.pointGraph && g as PointGraph != null){
				if (!autoLinkNodes.IsNone)
				(g as PointGraph).autoLinkNodes = autoLinkNodes.Value;
				if (!limits.IsNone)
				(g as PointGraph).limits = limits.Value ;
				if (!mask.IsNone)
				(g as PointGraph).mask = mask.Value ;
				if (!maxDistance.IsNone)
				(g as PointGraph).maxDistance = maxDistance.Value;
				if (!raycast.IsNone)
				(g as PointGraph).raycast = raycast.Value;
				if (!recursive.IsNone)
				(g as PointGraph).recursive  = recursive.Value;
				if (!searchTag.IsNone)
				(g as PointGraph).searchTag = searchTag.Value;
				if (!thickRaycast.IsNone)
				(g as PointGraph).thickRaycast = thickRaycast.Value;
				if (!thickRaycastRadius.IsNone)
				(g as PointGraph).thickRaycastRadius = thickRaycastRadius.Value ;
			}
			
			if(graphType == GraphType.gridGraph && g as GridGraph != null){
				if (!getNearestForceOverlap.IsNone)
				(g as GridGraph).getNearestForceOverlap = getNearestForceOverlap.Value ;
				if (!scans.IsNone)
				(g as GridGraph).scans = scans.Value;
				if (!size.IsNone)
				(g as GridGraph).size = size.Value;
			}

		}

		
		public function OnUpdate()
		{
			DoStuff();
		}
	  
   	}
	


