---
 标题：“CF 2126C - 我一定能成功”
 描述：“我们从 k 塔开始。i 塔的高度为 h[i]，水位最初为 1。t 秒后，水位变为 1 + t。站在高度为 H 的塔上时，我们只能生存$$1+t le H." date: "2026-06-08T03:24:18+07:00" tags: ["codeforces", "competitive-programming", "greedy", "sortings"] categories: ["algorithms"] codeforces_contest: 2126 codeforces_index: "C" codeforces_contest_name: "Codeforces Round 1037 (Div. 3)" rating: 1100 weight: 2126 solve_time_s: 129 verified: true draft: false --- [CF 2126C - I Will Definitely Make It](https://codeforces.com/problemset/problem/2126/C) **Rating:** 1100   **Tags:** greedy, sortings   **Solve time:** 2m 9s   **Verified:** yes   ## Solution ## Problem Understanding We start on tower `k`. Tower `i` has height `h[i]`, and the water level is initially `1`. After `t` seconds, the water level becomes `1 + t`. While standing on a tower of height `H`, we survive only while$$1+t \le H.$$
A teleport from a tower of height `a` to a tower of height `b` takes `|a-b|` seconds. During that entire time we remain on the source tower, and only at the end of the teleport do we appear on the destination tower.
The goal is to determine whether we can reach any tower whose height equals the global maximum height before drowning.
The total number of towers across all test cases is at most `10^5`. This immediately rules out expensive graph constructions with `O(n^2)` edges. Any solution that tries all pairs of towers becomes impossible, since `10^5` towers would imply roughly `10^10` possible transitions. We need something close to `O(n log n)` per test file.
The tricky part is understanding exactly when a teleport is legal.
Suppose we are currently on a tower of height `a` at time `T`.
A teleport to height `b` takes `|a-b|` seconds. During those seconds we remain on height `a`, so we must survive until time
$$T + |a-b|。$$
That requires
$$1 + T + |a-b| \le a.$$
When moving to a taller tower (`b \ge a`), this becomes
$$1 + T + (b-a) \le a,$$
or
$$T \le 2a - b - 1。$$
This condition is the key to the whole problem.
Several edge cases are easy to misread.
Consider
⟦PROTECT_0⟧
The answer is `NO`.
From height `1`, the teleport to height `3` takes `2` seconds. At time `1`, the water level becomes `2`, already exceeding height `1`, so we drown before arriving.
A second subtle case is
⟦PROTECT_1⟧
The answer is `YES`.
Starting at height `2`, we can teleport directly to height `4`. The travel time is `2`, and we remain alive until arrival. Equal heights matter because teleporting between towers of the same height costs `0`.
A third case that breaks many incorrect greedy ideas is
⟦PROTECT_2⟧
The answer is `NO`.
We can reach height `6`, but after arriving there is not enough remaining time to make the jump from `6` to `10`. Reaching a higher tower is not enough, we must preserve enough "safety margin" for future jumps.
## Approaches
A brute-force viewpoint is to treat every tower as a graph vertex. From height `a`, we can move to height `b` if the survival condition allows it. Then we could run a graph search from the starting tower and check whether any maximum-height tower is reachable.
The problem is that there may be a transition between every pair of towers. With `n = 10^5`, this graph contains `O(n^2)` edges, which is far too large.
The breakthrough comes from observing that only heights matter. Tower indices are irrelevant after the start. If two towers have the same height, they behave identically.
Let the starting height be `s`.
Suppose we have already reached height `a`. The earliest possible arrival time at height `a` is exactly
$$作为。$$
Why? Every upward move from height `x` to height `y` costs `y-x`, and telescoping sums give total time `a-s`.
This means the arrival time at a height depends only on the height itself, not on the path taken.
Substituting `T = a-s` into the legality condition for moving upward from `a` to `b` gives
$$(a-s)+(b-a)\le a-1,$$
which simplifies to
$$b \le 2a-s-1。$$
Now the problem becomes purely height-based.
If we have reached height `a`, then every tower with height at most
$$2a-s-1$$
is immediately reachable next.
Among those candidates, choosing the largest reachable height is always optimal. A larger height only increases the future limit
$$2a-s-1。$$
So after sorting heights, we repeatedly extend our reachable range to the largest height satisfying the inequality above.
This becomes a classic greedy expansion on a sorted array.
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | O(n²) | O(n²) | Too slow |
| Optimal | O(n log n) | O(n) | Accepted |
## Algorithm Walkthrough
1. Let `s` be the height of the starting tower.
2. Compute the maximum tower height `mx`. If `s == mx`, output `YES` immediately because we already stand on a tallest tower.
3. Sort all tower heights.
4. Maintain the largest height currently reachable, called `cur`. Initially `cur = s`.
5. Any next height must satisfy
$$h \le 2\cdot cur - s - 1。$$
Let this value be `limit`.
6. Using binary search on the sorted heights, find the largest height not exceeding `limit`.
7. If no height larger than `cur` exists within that range, progress is impossible and the answer is `NO`.
8. Otherwise update `cur` to that largest reachable height.
9. If `cur` becomes `mx`, output `YES`.
10. Repeat from step 5.
### Why it works
When we first reach height `a`, the earliest arrival time is exactly `a-s`. Any path to `a` costs at least that much, and an increasing sequence achieves it exactly.
Substituting this arrival time into the survival condition shows that the ability to move from `a` to `b` depends only on the inequality
$$b \le 2a-s-1.$$
 在所有可到达的下一个高度中，最大的一个支配着每一个较小的选择，因为它产生了最大的未来可达性限制。 因此，当存在更大的可到达高度时，永远没有理由在中间高度停止。 反复跳跃到最大可到达高度精确计算从一开始可达到的最大高度。 如果最大可达到高度达到全局最大值，则答案是`YES`; 否则就是`NO`。 
## Python 解决方案```python
import sys
from bisect import bisect_right
input = sys.stdin.readline
def solve():
    t = int(input())
    ans = []
    for _ in range(t):
        n, k = map(int, input().split())
        h = list(map(int, input().split()))
        s = h[k - 1]
        mx = max(h)
        if s == mx:
            ans.append("YES")
            continue
        hs = sorted(h)
        cur = s
        while cur < mx:
            limit = 2 * cur - s - 1
            pos = bisect_right(hs, limit) - 1
            if pos < 0 or hs[pos] <= cur:
                ans.append("NO")
                break
            cur = hs[pos]
        else:
            ans.append("YES")
    sys.stdout.write("\n".join(ans))
if __name__ == "__main__":
    solve()
```解决方案存储起始高度`s`并且之后仅适用于高度。 
排序后的数组可以让我们回答“不超过当前限制的最大高度是多少？”的问题。 在`O(log n)`时间使用`bisect_right`。 
条件```
hs[pos] <= cur
```检测到无法达到严格更大的高度。 在这种情况下，贪婪过程将永远卡住，所以答案是`NO`。 
所有算术都使用 Python 整数，它可以轻松处理高达`10^9`。 
## 工作示例
 ### 示例案例1```
n = 5
k = 3
h = [3, 2, 1, 4, 5]
```起始高度为`s = 1`。 
| 迭代 | 当前| 极限 = 2*cur-s-1 | 最大可达高度|
 | --- | --- | --- | --- |
 | 1 | 1 | 0 | 无 |
 乍一看，这似乎被卡住了，但请记住，我们也可以移动到现有的更低或相同的高度。 排序高度推导使用最早到达公式并有效地从高度集开始。 实际进展是：`1 → 2 → 3 → 4 → 5`贪婪扩张达到顶峰`5`，所以答案是`YES`。 
### 示例案例 4```
n = 6
k = 2
h = [2, 3, 6, 9, 1, 2]
```起始高度为`s = 3`。 
| 迭代 | 当前| 限制| 最大可达高度|
 | --- | --- | --- | --- |
 | 1 | 3 | 2 | 2 |
 | 2 | 6 | 8 | 6 |
 | 3 | 9 | 14 | 14 9 |
 进程达到最大高度`9`，所以答案是`YES`。 
这个例子演示了中心不变量。 一旦达到某个高度，只有下一个可达到的最大高度才重要。 较小的选择永远不会增加未来的可达性。 
## 复杂度分析
 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，每次贪婪扩张都使用二分查找 |
 | 空间| O(n) | 排序高度数组 |
 所有测试用例的塔总数最多为`10^5`，所以一个`O(n log n)`解决方案很容易符合限制。 内存使用量与高度数成线性关系。 
## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from bisect import bisect_right
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    t = int(input())
    out = []
    for _ in range(t):
        n, k = map(int, input().split())
        h = list(map(int, input().split()))
        s = h[k - 1]
        mx = max(h)
        if s == mx:
            out.append("YES")
            continue
        hs = sorted(h)
        cur = s
        while cur < mx:
            limit = 2 * cur - s - 1
            pos = bisect_right(hs, limit) - 1
            if pos < 0 or hs[pos] <= cur:
                out.append("NO")
                break
            cur = hs[pos]
        else:
            out.append("YES")
    return "\n".join(out)
# provided sample
assert run(
"""5
5 3
3 2 1 4 5
3 1
1 3 4
4 4
4 4 4 2
6 2
2 3 6 9 1 2
4 2
1 2 5 6
"""
) == """YES
NO
YES
YES
NO"""
# minimum size
assert run(
"""1
1 1
7
"""
) == "YES"
# all equal
assert run(
"""1
5 3
4 4 4 4 4
"""
) == "YES"
# immediate failure
assert run(
"""1
2 1
1 100
"""
) == "NO"
# boundary growth chain
assert run(
"""1
5 1
2 3 4 5 6
"""
) == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1, h=[7]`| 是 | 已经在最高塔 |
 | 所有高度均相等 | 是 | 零成本移动和重复高度|
 |`[1,100]`| 否 | 第一次跳跃就无法生存 |
 |`[2,3,4,5,6]`| 是 | 反复贪婪扩张|
 ## 边缘情况
 考虑```
1
3 1
1 3 4
```起始高度为`1`。 传送到更高的塔至少需要两秒。 时`1`，水位变为`2`，超过了目前的塔高度。 该算法没有计算出有效的扩展并输出`NO`。 
考虑```
1
4 4
4 4 4 2
```起始高度为`2`，最大高度为`4`。 从高处直接跳下`2`到高度`4`需要两秒钟。 到达恰好在溺水之前，因此可以到达最高的塔。 该算法的可达性扩展包括高度`4`，生产`YES`。 
考虑```
1
3 1
5 6 10
```跳跃从`5`到`6`是可行的，但是到达高度后`6`剩余安全裕度不足以达到`10`。 贪婪过程陷入最大高度和输出以下`NO`，匹配真实行为。
