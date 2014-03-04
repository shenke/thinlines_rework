using UnityEngine;
using System.Collections;
using Pathfinding;


namespace HutongGames.PlayMaker.Actions
{
   [ActionCategory("A Star")]
   [Tooltip("Updates a square area")]
   public class UpdateGraphArea   : FsmStateAction 
   {
   
	  [Tooltip("Center/Origin in worldspace.")]
	  public FsmVector3 center;
	  [Tooltip("Size in Worldspace")]
	  public FsmVector3 size;

   
   
		public override void OnEnter() {
			var bounds = new UnityEngine.Bounds (center.Value, size.Value);
			AstarPath.active.UpdateGraphs(bounds);
			Finish();
		} 
	}
}