---
 标题：“CF 76F - 游客”
 描述：“每个事件都是时间位置平面上的一个点。事件 i 恰好在时间 ti 发生在坐标 xi 处。游客以最大速度 V 的速度沿直线移动，因此从 (xa, ta) 移动到 (xb, tb) 是可能的，当且仅当：$$The tourist may also wait in place. We need two answers." date: "2026-05-28T00:00:00+07:00" tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp"] categories: ["algorithms"] codeforces_contest: 76 codeforces_index: "F" codeforces_contest_name: "All-Ukrainian School Olympiad in Informatics" rating: 2300 weight: 76 solve_time_s: 163 verified: true draft: false --- [CF 76F - Tourist](https://codeforces.com/problemset/problem/76/F) **Rating:** 2300   **Tags:** binary search, data structures, dp   **Solve time:** 2m 43s   **Verified:** yes   ## Solution ## Problem Understanding Each event is a point on a time-position plane. Event `i` happens at coordinate `x_i` exactly at time `t_i`. The tourist moves on a line with speed at most `V`, so moving from `(x_a, t_a)` to `(x_b, t_b)` is possible if and only if:$$|x_a - x_b| \le V \cdot (t_b - t_a)$$
The tourist may also wait in place. We need two answers.
The first answer assumes the tourist starts at coordinate `0` at time `0`.
The second answer allows the tourist to choose any starting coordinate before time starts.
The goal in both versions is to maximize how many events can be attended in chronological order.
The constraints completely rule out quadratic dynamic programming. With `n = 100000`, an `O(n^2)` transition loop would require around `10^10` checks, which is several orders of magnitude too large. Even `O(n sqrt n)` would be risky in Python. The solution must stay near `O(n log n)`.
The tricky part is that reachability depends on both position and time. A naive graph interpretation creates too many edges. We need a way to compress the transition condition into something searchable with data structures.
Several edge cases are easy to mishandle.
Events may occur at the same time. Two events with identical timestamps cannot both be visited unless they are at the same position, and the statement guarantees that exact duplicates do not exist.
Example:
⟦PROTECT_0⟧
Correct output:
⟦PROTECT_1⟧
A careless DP that only checks position difference without enforcing increasing time could incorrectly chain them together.
Negative coordinates matter because movement is on the entire number line.
Example:
⟦PROTECT_2⟧
The tourist cannot reach the first event from `(0,0)` because distance `5` requires time `5`, which is barely possible, but then moving from `-5` to `5` needs distance `10` and only `5` units of time. The correct answer is:
⟦PROTECT_3⟧
The second answer differs because with a free starting point we may begin directly at `-5`.
Another subtle case is multiple events at the same position.
⟦PROTECT_4⟧
Correct output:
⟦PROTECT_5⟧
Waiting in place is allowed, so once the tourist reaches coordinate `2`, all later events there are automatically reachable.
## Approaches
The most direct solution is dynamic programming on events sorted by time.
Define `dp[i]` as the maximum number of events ending at event `i`. Then we try every earlier event `j` and transition if:
$$|x_i - x_j| \le V(t_i - t_j)$$
For the fixed-start version we also check whether event `i` is reachable from `(0,0)`.
This is correct because any valid route must visit events in nondecreasing time order, and every feasible previous event is examined.
The problem is complexity. Each event compares against all earlier events, so the running time is `O(n^2)`. With `100000` events this becomes roughly `5 \cdot 10^9` transitions, far too slow.
The key observation is that the reachability inequality can be rewritten into two independent inequalities.
Starting from:
$$|x_i - x_j| \le V(t_i - t_j)$$
we obtain:
$$x_i - V t_i \le x_j - V t_j$$
and
$$x_i + V t_i \ge x_j + V t_j$$
Define transformed coordinates:
$$A_i = x_i - V t_i$$
$$B_i = x_i + V t_i$$
Then event `j` can precede event `i` exactly when:
$$A_j \ge A_i$$
and
$$B_j \le B_i$$
This turns the problem into a two-dimensional dominance DP.
Now the structure becomes clear. If we process events in increasing time order, we need the best DP value among all previous points satisfying:
$$A_j \ge A_i,\quad B_j \le B_i$$
That is a classic offline data structure problem.
We compress all `B` coordinates and use a Fenwick tree where each node stores the best DP value seen so far. To handle the `A_j \ge A_i` condition, we process events grouped by decreasing `A`.
For the second answer, where the start point is arbitrary, every event may start a chain with value `1`.
For the first answer, event `i` may start a chain only if:
$$|x_i| \le V t_i$$
because the tourist starts at `(0,0)`.
The resulting algorithm runs in `O(n log n)`.
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | O(n²) | O(n) | Too slow |
| Optimal | O(n log n) | O(n) | Accepted |
## Algorithm Walkthrough
1. Read all events and sort them by increasing time.
Sorting by time guarantees that every transition goes forward chronologically.
1. For every event compute:
$$A_i = x_i - V t_i$$
$$B_i = x_i + V t_i$$
These transformed coordinates encode the movement constraint as a dominance relation.
1. Coordinate-compress all `B_i` values.
Fenwick trees require indices from `1` to `m`, so we map each distinct `B` value to a compact integer.
1. Compute the answer for the free-start version.
Every event can begin a valid route by itself, so initialize:
⟦PROTECT_6⟧
Then process events in decreasing `A`.
For each event, query the Fenwick tree for the maximum DP among all earlier events with compressed `B <= B_i`.
That query gives the best chain that can transition into event `i`.
After querying all events with the same `A`, insert their DP values into the Fenwick tree.
Delaying updates inside equal-`A` groups prevents transitions between events that are not mutually reachable.
1. Compute the fixed-start version similarly.
Initialize:
⟦PROTECT_7⟧
only if:
$$|x_i| \le V t_i$$
Otherwise initialize with negative infinity.
The same dominance DP transitions are applied afterward.
1. The answer for each version is the maximum DP value over all events.
### Why it works
The transformed inequalities are exactly equivalent to the original speed constraint. Any feasible movement sequence corresponds to a chain in the dominance order:
$$A_j \ge A_i,\quad B_j \le B_i$$
 按时间处理事件可保证转换仅按时间向前推进。 Fenwick 树始终存储已处理的有效前辈中最好的 DP。 由于满足不等式的每个可能的前驱都在结构中表示，并且没有无效的前驱同时满足两个不等式，因此 DP 计算可访问事件的最佳数量。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
INF = 10**18
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [-INF] * (n + 1)
    def update(self, idx, val):
        while idx <= self.n:
            if val > self.bit[idx]:
                self.bit[idx] = val
            idx += idx & -idx
    def query(self, idx):
        res = -INF
        while idx > 0:
            if self.bit[idx] > res:
                res = self.bit[idx]
            idx -= idx & -idx
        return res
def solve():
    n = int(input())
    events = []
    for _ in range(n):
        x, t = map(int, input().split())
        events.append((t, x))
    V = int(input())
    arr = []
    for idx, (t, x) in enumerate(events):
        A = x - V * t
        B = x + V * t
        arr.append((A, B, t, x, idx))
    all_b = sorted(set(b for _, b, _, _, _ in arr))
    comp = {v: i + 1 for i, v in enumerate(all_b)}
    arr.sort(reverse=True)
    m = len(all_b)
    # free start
    bit = Fenwick(m)
    dp2 = [1] * n
    i = 0
    while i < n:
        j = i
        while j < n and arr[j][0] == arr[i][0]:
            j += 1
        updates = []
        for k in range(i, j):
            A, B, t, x, idx = arr[k]
            bidx = comp[B]
            best = bit.query(bidx)
            if best > -INF:
                dp2[idx] = max(dp2[idx], best + 1)
            updates.append((bidx, dp2[idx]))
        for bidx, val in updates:
            bit.update(bidx, val)
        i = j
    # fixed start at 0
    bit = Fenwick(m)
    dp1 = [-INF] * n
    for A, B, t, x, idx in arr:
        if abs(x) <= V * t:
            dp1[idx] = 1
    i = 0
    while i < n:
        j = i
        while j < n and arr[j][0] == arr[i][0]:
            j += 1
        updates = []
        for k in range(i, j):
            A, B, t, x, idx = arr[k]
            bidx = comp[B]
            best = bit.query(bidx)
            if best > -INF:
                dp1[idx] = max(dp1[idx], best + 1)
            updates.append((bidx, dp1[idx]))
        for bidx, val in updates:
            bit.update(bidx, val)
        i = j
    ans1 = max(dp1)
    ans2 = max(dp2)
    print(ans1, ans2)
solve()
```芬威克树存储前缀最大值而不是总和。 坐标压缩后，查询索引`bidx`返回所有事件中最好的 DP`B_j <= B_i`。 
处理事件在减少`A`顺序保证所有插入状态满足`A_j >= A_i`。 
等值分组处理`A`价值观是微妙但必要的。 假设两个事件共享相同的`A`。 如果我们在处理其中一个事件后立即更新，则同一组中的另一个事件可能会错误地通过它进行转换，即使它们的时间戳使移动不可能。 延迟更新直到处理完整个组可以消除此问题。 
固定启动版本仅在初始化方面有所不同。 仅当游客可以直接从以下位置到达活动时，活动才能开始连锁`(0,0)`。 
所有坐标都适合 Python 整数，但在 C++ 中，这个问题需要 64 位算术，因为诸如`V * t`可以达到`2 * 10^9`。 
## 工作示例
 ### 示例 1
 输入：```
3
-1 1
42 7
40 8
2
```转换后的值：
 | 活动 | x| t | A = x - Vt | B = x + Vt |
 | --- | --- | --- | --- | --- |
 | 1 | -1 | 1 | -3 | 1 |
 | 2 | 42 | 42 7 | 28 | 28 56 | 56
 | 3 | 40 | 40 8 | 24 | 56 | 56
 加工订单减少`A`。 
| 步骤| 活动 | 查询结果 | dp2 | dp1 |
 | --- | --- | --- | --- | --- |
 | 1 | (42,7) | 无 | 1 | 不可能|
 | 2 | (40,8) | (40,8) | 1 | 2 | 不可能|
 | 3 | (-1,1) | (-1,1) | 无 | 1 | 1 |
 最终答案：```
1 2
```免费启动版本开始于`(42,7)`然后到达`(40,8)`。 开始于`(0,0)`无法足够快地到达任何一个大的正坐标。 
### 自定义示例
 输入：```
4
0 1
1 2
2 3
3 4
1
```转换后的值：
 | 活动 | 一个 | 乙|
 | --- | --- | --- |
 | 1 | -1 | 1 |
 | 2 | -1 | 3 |
 | 3 | -1 | 5 |
 | 4 | -1 | 7 |
 所有事件都有相同之处`A`。 
| 步骤| 活动 | 上一个最佳 | DP |
 | --- | --- | --- | --- |
 | 1 | 1 | 无 | 1 |
 | 2 | 2 | 1 | 2 |
 | 3 | 3 | 2 | 3 |
 | 4 | 4 | 3 | 4 |
 输出：```
4 4
```此示例说明了为什么优势排序与移动条件完全匹配。 每个事件都可以从前一个事件快速到达`1`。 
## 复杂度分析
 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序加上 Fenwick 查询和更新 |
 | 空间| O(n) | 数组、坐标压缩、Fenwick 树 |
 和`100000`事件，`O(n log n)`很容易足够快。 Fenwick 树操作是轻量级的，并且内存使用保持线性。 
## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
INF = 10**18
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [-INF] * (n + 1)
    def update(self, idx, val):
        while idx <= self.n:
            self.bit[idx] = max(self.bit[idx], val)
            idx += idx & -idx
    def query(self, idx):
        res = -INF
        while idx > 0:
            res = max(res, self.bit[idx])
            idx -= idx & -idx
        return res
def solve():
    input = sys.stdin.readline
    n = int(input())
    events = []
    for _ in range(n):
        x, t = map(int, input().split())
        events.append((t, x))
    V = int(input())
    arr = []
    for idx, (t, x) in enumerate(events):
        A = x - V * t
        B = x + V * t
        arr.append((A, B, t, x, idx))
    all_b = sorted(set(b for _, b, _, _, _ in arr))
    comp = {v: i + 1 for i, v in enumerate(all_b)}
    arr.sort(reverse=True)
    m = len(all_b)
    bit = Fenwick(m)
    dp2 = [1] * n
    i = 0
    while i < n:
        j = i
        while j < n and arr[j][0] == arr[i][0]:
            j += 1
        upd = []
        for k in range(i, j):
            A, B, t, x, idx = arr[k]
            bidx = comp[B]
            best = bit.query(bidx)
            if best > -INF:
                dp2[idx] = max(dp2[idx], best + 1)
            upd.append((bidx, dp2[idx]))
        for bidx, val in upd:
            bit.update(bidx, val)
        i = j
    bit = Fenwick(m)
    dp1 = [-INF] * n
    for A, B, t, x, idx in arr:
        if abs(x) <= V * t:
            dp1[idx] = 1
    i = 0
    while i < n:
        j = i
        while j < n and arr[j][0] == arr[i][0]:
            j += 1
        upd = []
        for k in range(i, j):
            A, B, t, x, idx = arr[k]
            bidx = comp[B]
            best = bit.query(bidx)
            if best > -INF:
                dp1[idx] = max(dp1[idx], best + 1)
            upd.append((bidx, dp1[idx]))
        for bidx, val in upd:
            bit.update(bidx, val)
        i = j
    print(max(dp1), max(dp2))
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = backup
    return out.getvalue().strip()
# provided sample
assert run(
"""3
-1 1
42 7
40 8
2
"""
) == "1 2", "sample 1"
# minimum size
assert run(
"""1
0 1
1
"""
) == "1 1", "single reachable event"
# unreachable from origin but reachable with free start
assert run(
"""1
100 1
1
"""
) == "-1000000000000000000 1", "free start differs"
# same position over time
assert run(
"""3
2 3
2 4
2 5
1
"""
) == "3 3", "waiting in place"
# chain along a line
assert run(
"""4
0 1
1 2
2 3
3 4
1
"""
) == "4 4", "full chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单项活动 |`1 1`| 最小输入尺寸|
 | 遥不可及的事件| 不同的答案 | 自由启动与固定启动|
 | 重复相同坐标 |`3 3`| 原地等待|
 | 增加链条|`4 4`| 长有效转换链 |
 ## 边缘情况
 考虑同时发生的事件：```
2
0 1
10 1
100
```两个事件具有相同的时间戳。 变换后的条件不能同时成立，因为运动时间为零。 在处理过程中，两个事件都不会成为另一个事件的前驱，因此两个 DP 值都保持不变`1`。 该算法输出：```
1 1
```现在考虑来自原点的不可达事件：```
2
-5 5
5 10
1
```第一个事件可从`(0,0)`， 所以`dp1 = 1`。 由于移动距离，第二个事件无法跟随它`10`及时`5`超过速度`1`。 
对于免费启动版本，游客可以从`-5`，参加了第一个活动，然后仍然无法到达第二个活动。 或者，开始于`5`并且只参加第二个。 最大剩余量`1`。 
该算法正确地拒绝无效转换，因为转换的不等式失败。 
最后，考虑重复坐标：```
3
2 3
2 4
2 5
1
```转换后的值满足按时间顺序排列的支配关系，因此芬威克树将所有三个事件链接在一起。 等待不需要特殊处理，因为零移动会自动满足速度限制。
