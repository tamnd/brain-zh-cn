---
 标题：“CF 2187B - 最短的声明”
 描述：“我们有两个整数 x 和 y。我们必须构造两个新的非负整数 p 和 q，使得两个数字中没有一个位位置同时包含 1。换句话说，p & q = 0。在所有这些对中，我们想要最小化的一对$$The task is constructive." date: "2026-06-07T21:21:40+07:00" tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dp", "greedy"] categories: ["algorithms"] codeforces_contest: 2187 codeforces_index: "B" codeforces_contest_name: "Codeforces Round 1077 (Div. 1)" rating: 1800 weight: 2187 solve_time_s: 253 verified: false draft: false --- [CF 2187B - Shortest Statement Ever](https://codeforces.com/problemset/problem/2187/B) **Rating:** 1800   **Tags:** bitmasks, constructive algorithms, dp, greedy   **Solve time:** 4m 13s   **Verified:** no   ## Solution ## Problem Understanding We are given two integers, `x` and `y`. We must construct two new non-negative integers, `p` and `q`, such that no bit position contains `1` in both numbers simultaneously. In other words, `p & q = 0`. Among all such pairs, we want the one that minimizes$$|x-p| + |y-q|。$$
The task is constructive. We do not need the minimum value itself, only one optimal pair `(p, q)`.
The numbers are smaller than $2^{30}$, but there can be up to $10^4$ test cases. Any solution whose running time depends on the numeric value of `x` or `y` is immediately impossible. The only usable structure is their binary representation. Since the numbers contain at most 30 bits, a solution with a small constant amount of work per bit is easily fast enough.
The main difficulty is that absolute values are global quantities. Changing a high bit may completely determine whether `p > x` or `p < x`, and once that relationship is fixed, every lower bit contributes differently to the final distance.
A common mistake is to greedily process each bit independently.
Consider:
⟦PROTECT_0⟧
Both numbers have bit 0 equal to 1. If we simply keep that bit in one number and clear it in the other, we obtain either `(1,0)` or `(0,1)`, both with cost 1. The optimal answer is `(2,1)` or `(1,2)`, also cost 1. A local decision at the lowest bit is not enough to characterize all optimal solutions.
Another subtle case is:
⟦PROTECT_1⟧
The best answer changes a higher bit and compensates with lower bits. Looking only at the current bit cannot determine whether increasing or decreasing a number is better.
These examples suggest a digit-DP style solution where the effect of higher bits is remembered while processing lower bits.
## Approaches
The brute-force idea is straightforward. Enumerate all possible pairs `(p, q)` satisfying `p & q = 0`, compute the objective value, and keep the best one.
This works conceptually because the objective is explicit and easy to evaluate. Unfortunately, even restricting ourselves to numbers below $2^{31}$, the search space contains roughly $2^{62}$ pairs. That is completely infeasible.
The key observation is that the constraint `p & q = 0` is local to each bit. At every bit position, only three configurations are allowed:
⟦PROTECT_2⟧
The objective is not local because of the absolute values, but binary digit DP is designed exactly for this situation.
Suppose we process bits from most significant to least significant. For the pair `(p, x)`, only three relationships are possible after examining the already processed higher bits:
⟦PROTECT_3⟧
Once a higher bit makes `p` larger than `x`, that fact can never change. Every remaining lower bit contributes linearly to `p - x`. The same idea applies to `(q, y)`.
This gives a very small DP state:
⟦PROTECT_4⟧
There are only `31 * 3 * 3 = 279` states.
For every state we try the three allowed bit assignments and choose the one leading to minimum total distance.
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | $O(2^{62})$ | $O(1)$ | Too slow |
| Optimal Digit DP | $O(31 \cdot 3 \cdot 3 \cdot 3)$ | $O(31 \cdot 3 \cdot 3)$ | Accepted |
## Algorithm Walkthrough
1. Process bits from bit 30 down to bit 0.
2. Maintain a state `(i, sx, sy)`.
`i` is the current bit.
`sx` describes the relationship between the already processed prefixes of `p` and `x`.
`sy` describes the relationship between the already processed prefixes of `q` and `y`.
Each relation is one of `-1`, `0`, `1`, meaning smaller, equal, or larger.
3. For the current bit, try all three allowed assignments:
⟦PROTECT_5⟧
4. Update the relation state.
If the prefixes were already different, the relation does not change.
If they were equal, the current bit may establish a new relation.
5. Compute the contribution of the current bit.
If the relation was already fixed earlier, this bit contributes directly to the absolute difference.
For example, if higher bits already guarantee `p > x`, then the contribution to `|p-x|` from the current bit is
$$(p_i - x_i)\cdot 2^i。$$
If higher bits already guarantee `p < x`, the contribution becomes
$$(x_i - p_i)\cdot 2^i。$$
If the prefixes were equal before this bit, then a differing current bit contributes exactly $2^i$, because it becomes the first differing bit.
6. Add the contribution from the `x` side and the `y` side.
7. Recurse to the next bit and keep the minimum total cost.
8. Store decisions so that after computing the minimum cost, we can reconstruct one optimal pair `(p, q)`.
### Why it works
The first differing bit completely determines whether one number is larger than the other. After that point, every lower bit affects the absolute difference only through ordinary signed arithmetic.
The DP state records exactly the information needed for future decisions: whether the first differing bit has already appeared and, if it has, in which direction the comparison went.
Because every allowed bit assignment is examined and every future consequence depends only on the current state, the DP explores all feasible pairs `(p, q)` and chooses the one with minimum value of
$$|x-p| + |y-q|.$$
 任何最优解都不能错过。 
## Python 解决方案```python
import sys
from functools import lru_cache
input = sys.stdin.readline
BITS = 30
def solve_case(x, y):
    choices = ((0, 0), (1, 0), (0, 1))
    @lru_cache(None)
    def dp(bit, sx, sy):
        if bit < 0:
            return 0
        xb = (x >> bit) & 1
        yb = (y >> bit) & 1
        w = 1 << bit
        best = 10**18
        for pb, qb in choices:
            nsx = sx
            cx = 0
            if sx == 0:
                if pb > xb:
                    nsx = 1
                    cx = w
                elif pb < xb:
                    nsx = -1
                    cx = w
            elif sx == 1:
                cx = (pb - xb) * w
            else:
                cx = (xb - pb) * w
            nsy = sy
            cy = 0
            if sy == 0:
                if qb > yb:
                    nsy = 1
                    cy = w
                elif qb < yb:
                    nsy = -1
                    cy = w
            elif sy == 1:
                cy = (qb - yb) * w
            else:
                cy = (yb - qb) * w
            best = min(best, cx + cy + dp(bit - 1, nsx, nsy))
        return best
    p = 0
    q = 0
    sx = 0
    sy = 0
    for bit in range(BITS, -1, -1):
        xb = (x >> bit) & 1
        yb = (y >> bit) & 1
        w = 1 << bit
        target = dp(bit, sx, sy)
        for pb, qb in choices:
            nsx = sx
            cx = 0
            if sx == 0:
                if pb > xb:
                    nsx = 1
                    cx = w
                elif pb < xb:
                    nsx = -1
                    cx = w
            elif sx == 1:
                cx = (pb - xb) * w
            else:
                cx = (xb - pb) * w
            nsy = sy
            cy = 0
            if sy == 0:
                if qb > yb:
                    nsy = 1
                    cy = w
                elif qb < yb:
                    nsy = -1
                    cy = w
            elif sy == 1:
                cy = (qb - yb) * w
            else:
                cy = (yb - qb) * w
            value = cx + cy + dp(bit - 1, nsx, nsy)
            if value == target:
                if pb:
                    p |= w
                if qb:
                    q |= w
                sx = nsx
                sy = nsy
                break
    return p, q
def main():
    t = int(input())
    ans = []
    for _ in range(t):
        x, y = map(int, input().split())
        p, q = solve_case(x, y)
        ans.append(f"{p} {q}")
    sys.stdout.write("\n".join(ans))
if __name__ == "__main__":
    main()
```DP 函数计算从一个状态开始的最小可实现成本。 关系状态被编码为`-1`,`0`， 和`1`。 
最微妙的部分是贡献计算。 当关系已知时，较低位贡献有符号差。 当关系仍然相等并且当前位成为第一个不同位时，贡献正是该位的权重。 
重建遵循相同的转变。 在每一位上，我们选择其值与最佳 DP 值匹配的任何转换。 这保证了重建的对是最优的。 
该解决方案执行的算术永远不会超过几十亿，这完全在 Python 的整数能力范围内。 
## 工作示例
 ### 示例 1
 输入：```
x = 1
y = 1
```| 位| x 位 | y 位 | 选择（p位，q位）| 关系 p/x | 关系 q/y |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 0 | (1,0)| p>x| 等于|
 | 0 | 1 | 1 | (0,1)| p>x| 等于|
 结果：```
p = 2
q = 1
```成本：```
|2-1| + |1-1| = 1
```该轨迹表明，最佳答案可能会增加一个数字，而不是仅仅清除一个冲突位。 
### 示例 2
 输入：```
x = 4
y = 4
```二进制：```
100
100
```| 位| x 位 | y 位 | 选择（p位，q位）| 关系 p/x | 关系 q/y |
 | ---| ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | (1,0)| 等于| q<y |
 | 1 | 0 | 0 | (0,1)| 等于| q<y |
 | 0 | 0 | 0 | (0,1)| 等于| q<y |
 结果：```
p = 4
q = 3
```成本：```
|4-4| + |3-4| = 1
```This example demonstrates how the DP distributes overlapping bits between the two numbers while keeping the total distance minimal.
 ## 复杂度分析
 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(31 \cdot 3 \cdot 3 \cdot 3)$每个测试用例| 31 位、9 种状态、3 种转换 |
 | 空间|$O(31 \cdot 3 \cdot 3)$| DP记忆表|
 州的数量很少，只有几百个。 即使与$10^4$测试用例中，该解决方案很容易满足时间限制并且使用的内存可以忽略不计。 
## 测试用例```
# helper validation utilities
def valid(x, y, p, q):
    cost = abs(x - p) + abs(y - q)
    assert (p & q) == 0
    return cost
# sample-style checks
p, q = solve_case(0, 0)
assert (p & q) == 0
assert valid(0, 0, p, q) == 0
p, q = solve_case(1, 1)
assert (p & q) == 0
assert valid(1, 1, p, q) == 1
# minimum values
p, q = solve_case(0, 0)
assert p == 0 and q == 0
# all equal values
p, q = solve_case(4, 4)
assert (p & q) == 0
assert valid(4, 4, p, q) == 1
# one value already compatible
p, q = solve_case(3, 4)
assert (p & q) == 0
assert valid(3, 4, p, q) == 0
# maximum boundary
mx = (1 << 30) - 1
p, q = solve_case(mx, mx)
assert (p & q) == 0
# asymmetric case
p, q = solve_case(123, 321)
assert (p & q) == 0
```| 测试输入
