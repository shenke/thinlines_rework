#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import System.Collections.Generic;


//This script saves all kinds of conversions. Mostly from FsmObject to a specific type, but it also has functions to check for a variable being null and to convert certain arrays to certain generic lists and vice versa

public static class FsmConverter { // leave this as separate functions unless you want it to become terribly messy. Been there done that ;D



	
// real convertors first:
// Single array to generic list :
		public function NodeListToArray(go : Node[]){
			var out : List.<Node> = new List.<Node>();
			
			
			var x = 0;
			while (x<go.Length)
			{
				out.Add(go[x]);
				x++;

			}
			
			return out;
		
		}
		
		public function NodeArrayFromList(go : List.<Node>){
			var outo : Node[] = new Node[go.Count-1];
			
			
			var x = 0;
			while (x<go.Count)
			{
				outo[x] = go[x];
				x++;

			}
			
			return outo;
		
		}

		
		public function v3i3(go : Vector3,doo : Node ){
			return (new Int3(go.x/doo.position.PrecisionFactor,go.y/doo.position.PrecisionFactor,go.z/doo.position.PrecisionFactor));
		}

		public function GridNodeToList(go : Nodes.GridNode[]){
			var out : List.<Nodes.GridNode>;
			
			var x = 0;
			while (x<go.Length)
			{
				out[x] = go[x];
				x++;
			}
			
			return out;
		
		}
		
		public function FsmGetTypeOf(go) {
			//var mo : FsmPathfindingBase = go as FsmPathfindingBase;
			if(go){
				var doo = (go as FsmPathfindingBase).Value;
				return typeof(doo.Value);
			}
			else return null;
		}
		
	
		public function FsmIsNull(go) {
			try	{
				var doo = (go as FsmPathfindingBase).Value;
				return doo.Value == null;
				}
			catch (e : InvalidCastException) {
				return true;
			}
		}
		

		
		public function GetAnythingShallow(mo) {
			var go = mo as FsmObject;
			var typo = typeof(go.Value);	
			
			if (typo == FsmNode) { //Node
				//Debug.Log(typo);
				return GetNode(go) as Node;
			}
			
			else if (typo == FsmGridNode) { //GridNode
				//Debug.Log("GridNode");
				return GetGridNode(go) as Nodes.GridNode;
			}
			
			else if (typo == FsmNodes) { //Node[]
				//Debug.Log("Nodes");
				return GetNodes(go) as Node[];
			}
			
			else if (typo == FsmGridNodes) { //GridNode[]
				//Debug.Log("GridNodes");
				return GetGridNodes(go) as Nodes.GridNode[];
			}
			
			else if (typo == FsmPath) { //Path
				//Debug.Log("Path");
				return GetPath(go) as Path;
			}
		
			else if (typo == FsmABPath) { //ABPath
				//Debug.Log("ABPath");
				return GetPath(go) as ABPath;
			}
			
			else if (typo == FsmPointGraph) { //PointGraph
				//Debug.Log("PointGraph");
				return GetPointGraph(go) as PointGraph;
			}
		
			else if (typo == FsmPointGraphs) { //PointGraphs
				//Debug.Log("PointGraphs");
				return GetPointGraphs(go) as PointGraph[];
			}
			return null;
		}
		


// AstarPath
		public function GetAstarPath(go : FsmObject) : AstarPath{ //Turns the action input directly into an AstarPath
			var doo = FsmAstarPath();
			doo = go.Value as FsmAstarPath;
			var foo : AstarPath;
			foo = doo.Value as AstarPath;
			return foo;
		}
		
		public function SetAstarPath(go : AstarPath) : FsmAstarPath{ //Uses FsmAstarPath as input and returns AstarData
			var doo : FsmAstarPath = FsmAstarPath();
			doo.Value = go;
			return doo;
		}

		
// AstarData	
		public function GetAstarData(go : FsmObject) : AstarData{ //Uses FsmAstarData as input and returns AstarData
			var doo : FsmAstarData = go.Value as FsmAstarData;
			var foo : AstarData = doo.Value;
			return foo;
		}
		public function SetAstarData(go : AstarData) : FsmAstarData{ //Uses FsmAstarData as input and returns AstarData
			var doo : FsmAstarData = FsmAstarData();
			doo.Value = go;
			return doo;
		}
		
		
// NavGraphs	
		public function GetNavGraphs(go : FsmObject) : NavGraph[]{ 
			var doo : FsmNavGraphs = go.Value as FsmNavGraphs;
			var foo : NavGraph[] = doo.Value;
			return foo;
		}
		public function SetNavGraphs(go : NavGraph[]) : FsmNavGraphs{ 
			var doo : FsmNavGraphs = FsmNavGraphs();
			doo.Value = go;
			return doo;
		}
		
// NavGraph	
		public function GetNavGraph(go : FsmObject) : NavGraph{ 
			var doo : FsmNavGraph = go.Value as FsmNavGraph;
			var foo : NavGraph = doo.Value;
			return foo;
		}
		public function SetNavGraph(go : NavGraph) : FsmNavGraph{ 
			var doo : FsmNavGraph = FsmNavGraph();
			doo.Value = go;
			return doo;
		}

// PointGraphs	
		public function GetPointGraphs(go : FsmObject) : PointGraph[]{ 
			var doo : FsmPointGraphs = go.Value as FsmPointGraphs;
			var foo : PointGraph[] = doo.Value;
			return foo;
		}
		public function SetPointGraphs(go : PointGraph[]) : FsmPointGraphs{ 
			var doo : FsmPointGraphs = FsmPointGraphs();
			doo.Value = go;
			return doo;
		}
		
// PointGraph	
		public function GetPointGraph(go : FsmObject) : PointGraph{ 
			var doo : FsmPointGraph = go.Value as FsmPointGraph;
			var foo : PointGraph = doo.Value;
			return foo;
		}
		public function SetPointGraph(go : PointGraph) : FsmPointGraph{ 
			var doo : FsmPointGraph = FsmPointGraph();
			doo.Value = go;
			return doo;
		}
		
// node	
		public function GetNode(go : FsmObject) : Node{ 
			var doo : FsmNode = go.Value as FsmNode;
			var foo : Node = doo.Value;
			return foo;
		}
		public function SetNode(go : Node) : FsmNode{ 
			var doo : FsmNode = FsmNode();
			doo.Value = go;
			return doo;
		}
		
// nodes		
		public function GetNodes(go : FsmObject) : List.<Node>{ 
			var doo : FsmNodes = go.Value as FsmNodes;
			var foo : List.<Node> = doo.Value;
			return foo;
		}
		public function SetNodes(go : List.<Node>) : FsmNodes{ 
			var doo : FsmNodes = FsmNodes();
			doo.Value = go;
			return doo;
		}

// gridNode	
		public function GetGridNode(go : FsmObject) : Nodes.GridNode{ 
			var doo : FsmGridNode = go.Value as FsmGridNode;
			var foo : Nodes.GridNode = doo.Value;
			return foo;
		}
		public function SetGridNode(go : Nodes.GridNode) : FsmGridNode{ 
			var doo : FsmGridNode = new FsmGridNode();
			doo.Value = go;
			return doo;
		}
		
// gridNodes		
		public function GetGridNodes(go : FsmObject) : Nodes.GridNode[]{ 
			var doo : FsmGridNodes = go.Value as FsmGridNodes;
			var foo : Nodes.GridNode[] = doo.Value;
			return foo;
		}
		public function SetGridNodes(go : Nodes.GridNode[]) :FsmGridNodes{ 
			var doo : FsmGridNodes = FsmGridNodes();
			doo.Value = go;
			return doo;
		}

		
// path	
		public function GetPath(go : FsmObject) : Path{ 
			var doo : FsmPath = go.Value as FsmPath;
			var foo : Path = doo.Value;
			return foo;
		}
		public function GetABPath(go : FsmObject) : ABPath{ 
			var doo : FsmPath = go.Value as FsmPath;
			var foo : ABPath = doo.Value as ABPath;
			return foo;
		}
		public function SetPath(go : Path) : FsmPath{ 
			var doo : FsmPath = FsmPath();
			doo.Value = go;
			return doo;
		}
		
// paths	
		public function GetPaths(go : FsmObject) : Path[]{ 
			var doo : FsmPaths = go.Value as FsmPaths;
			var foo : Path[] = doo.Value;
			return foo;
		}
		public function SetPaths(go : Path[]) : FsmPaths{ 
			var doo : FsmPaths = FsmPaths();
			doo.Value = go;
			return doo;
		}
		
//NNConstraint
		public function GetNNConstraint(go : FsmObject) : NNConstraint{ 
			var doo : FsmNNConstraint = go.Value as FsmNNConstraint;
			var foo : NNConstraint = doo.Value;
			return foo;
		}
		public function SetNNConstraint(go : NNConstraint) : FsmNNConstraint{ 
			var doo : FsmNNConstraint = FsmNNConstraint();
			doo.Value = go;
			return doo;
		}
		
//NodeRunData
		public function GetNodeRunData(go : FsmObject){ 
			var doo : FsmNodeRunData = go.Value as FsmNodeRunData;
			var foo : NodeRunData = doo.Value;
			return foo;
		}
		public function SetNodeRunData(go : NodeRunData) : FsmNodeRunData{ 
			var doo : FsmNodeRunData = FsmNodeRunData();
			doo.Value = go;
			return doo;
		}
   	}
	

	//public function Reset(){
	//}

	//public function OnEnter(){
	//var doo : FsmPath = InputPath.Value;
	//}

