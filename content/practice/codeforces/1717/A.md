---
 标题：《CF 1717A - 小圆和奇怪的想法》
 描述：“对于每个测试用例，我们都会得到一个数字 n。我们考虑每个有序对 (a, b)，使得两个数字都位于 1 和 n 之间。在这些对中，我们想要计算有多少满足$$frac{operatorname{lcm}(a,b)}{gcd(a,b)} le 3." date: "2026-06-09T19:46:29+07:00" tags: ["codeforces", "competitive-programming", "math", "number-theory"] categories: ["algorithms"] codeforces_contest: 1717 codeforces_index: "A" codeforces_contest_name: "Codeforces Round 818 (Div. 2)" rating: 800 weight: 1717 solve_time_s: 57 verified: true draft: false --- [CF 1717A - Madoka and Strange Thoughts](https://codeforces.com/problemset/problem/1717/A) **Rating:** 800   **Tags:** math, number theory   **Solve time:** 57s   **Verified:** yes   ## Solution ## Problem Understanding For each test case we are given a number `n`. We consider every ordered pair `(a, b)` such that both numbers lie between `1` and `n`. Among those pairs, we want to count how many satisfy$$\frac{\operatorname{lcm}(a,b)}{\gcd(a,b)} \le 3.$$
The answer is the number of ordered pairs with this property.
The limits are very revealing. There can be up to `10^4` test cases, and each `n` can be as large as `10^8`. Any approach that iterates over all pairs immediately becomes impossible, since one test case alone would contain `10^16` pairs. Even an `O(n)` solution per test case would perform about `10^{12}` operations in the worst case across all tests, which is too much. The target complexity is constant time per test case.
There are a few edge cases that deserve attention.
For `n = 1`, the only pair is `(1,1)`, so the answer is `1`. A formula that accidentally assumes the existence of numbers greater than `1` would fail here.
For example:
⟦PROTECT_0⟧
The correct output is
⟦PROTECT_1⟧
For `n = 2`, every ordered pair works:
⟦PROTECT_2⟧
so the answer is `4`. A careless derivation that forgets ordered pairs and counts only unordered pairs would produce `3`.
For example:
⟦PROTECT_3⟧
The correct output is
⟦PROTECT_4⟧
Another common mistake is to assume that only equal numbers are valid. For `n = 3`, pairs `(1,3)` and `(3,1)` also satisfy the condition because
$$\frac{\operatorname{lcm}(1,3)}{\gcd(1,3)}=3。$$
The correct answer is `7`.
Input:
⟦PROTECT_5⟧
Output:
⟦PROTECT_6⟧
## Approaches
The most direct solution examines every ordered pair `(a,b)`, computes `gcd(a,b)` and `lcm(a,b)`, and checks whether their ratio is at most `3`. Since there are `n²` pairs, this requires up to `10^16` checks when `n = 10^8`, which is hopeless.
The brute force works because it literally follows the definition, but it ignores the arithmetic structure hidden inside the ratio.
Suppose
$$g=\gcd(a,b)。$$
We may write
$$a=gx,\qquad b=gy,$$
where `gcd(x,y)=1`.
Since
$$\运算符名称{lcm}(a,b)=gxy,$$
the ratio becomes
$$\frac{\运算符名称{lcm}(a,b)}{\gcd(a,b)}
 =xy。$$
Now the problem becomes much simpler. We need coprime positive integers `x` and `y` whose product is at most `3`.
The possibilities are extremely limited.
When `xy=1`, we have
⟦PROTECT_7⟧
When `xy=2`, the coprime pairs are
⟦PROTECT_8⟧
When `xy=3`, the coprime pairs are
⟦PROTECT_9⟧
No larger product is allowed.
Multiplying these pairs by `g` gives:
⟦PROTECT_10⟧
The value of `g` must keep both numbers at most `n`.
Equal pairs contribute `n`.
Pairs `(g,2g)` and `(2g,g)` exist for every `g ≤ n/2`, contributing `2⌊n/2⌋`.
Pairs `(g,3g)` and `(3g,g)` exist for every `g ≤ n/3`, contributing `2⌊n/3⌋`.
Hence
$$\boxed{n+2\left\lfloor\frac n2\right\rfloor+2\left\lfloor\frac n3\right\rfloor}$$
 这是每个测试用例的恒定时间。 
| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 ## 算法演练
 1. 读取值`n`。 
2. 数出所有数量相等的对。 正好有`n`这样的对因为`(g,g)`对每个都有效`1 ≤ g ≤ n`。 
3. 计算表格的对数`(g,2g)`和`(2g,g)`。 价值`g`范围可以从`1`到`⌊n/2⌋`，所以这些贡献`2⌊n/2⌋`。 
4. 计算表格的对数`(g,3g)`和`(3g,g)`。 这里`g`范围从`1`到`⌊n/3⌋`, 贡献`2⌊n/3⌋`。 
5. 将三个贡献相加并打印结果。 
### 为什么它有效
 将两个数字除以它们的 gcd 后，剩下的数字互质。 比率`lcm/gcd`成为那些互质数的乘积。 由于该产品不得超过`3`，仅标准化对`(1,1)`,`(1,2)`,`(2,1)`,`(1,3)`， 和`(3,1)`是可能的。 每个有效对都是通过将这些归一化对之一乘以某个正整数来唯一获得的`g`。 计数公式恰好涵盖了所有此类选择一次，因此算法不会错过一对或对一个进行两次计数。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
t = int(input())
for _ in range(t):
    n = int(input())
    ans = n + 2 * (n // 2) + 2 * (n // 3)
    print(ans)
```该程序独立处理每个测试用例。 使用整数除法是因为只有完整的倍数才适合该范围`[1, n]`。 
期限`n`计数相等的对。 期限`2 * (n // 2)`两者都算`(g,2g)`和`(2g,g)`， 尽管`2 * (n // 3)`计数`(g,3g)`和`(3g,g)`。 
使用整数运算可以避免精度问题。 Python 整数自动处理最大可能的答案，即`266666666`什么时候`n = 10^8`。 
操作顺序很简单，因为这三个类别是不相交的。 没有一对属于多个类别。 
## 工作示例
 ### 示例 1：n = 3
 | 步骤| 价值|
 | --- | --- |
 | 同等对 | 3 |
 | 比例为 2 的配对 | 2 |
 | 比例为 3 的配对 | 2 |
 | 总计 | 7 |
 有效的对是```
(1,1)
(2,2)
(3,3)
(1,2)
(2,1)
(1,3)
(3,1)
```这个例子表明，不相等的数字也可以满足条件。 
### 示例 2：n = 5
 | 步骤| 价值|
 | --- | --- |
 | 同等对 | 5 |
 | 比例为 2 的配对 | 4 |
 | 配对 w | |
