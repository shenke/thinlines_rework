using UnityEngine;
using System.Collections;
using Pathfinding;


namespace HutongGames.PlayMaker.Actions
{
   [ActionCategory("A Star")]
   [Tooltip("Scans all graphs")]
   public class ScanGraphs   : FsmStateAction 
   {

		public override void OnEnter() {
			AstarPath.active.Scan();
			Finish();
		} 
	}
}