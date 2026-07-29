---
title: "CF 102769G - 好号码"
description: "直接解决方案将迭代从 1 到 n 的每个整数 x。 对于每个数字，我们将计算 a = Floor(x^(1/k)) 并测试是否 x % a == 0。这是正确的，因为它完全遵循定义。"
date: "2026-07-28T23:20:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102769
codeforces_index: "G"
codeforces_contest_name: "2020 China Collegiate Programming Contest Qinhuangdao Site"
rating: 0
weight: 102769
solve_time_s: 69
verified: true
draft: false
---

[CF 102769G - 好数字](https://codeforces.com/problemset/problem/102769/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 直接的解决方案将迭代每个整数`x`从 1 到`n`。 对于每个数字，我们将计算`a = floor(x^(1/k))`并测试是否`x % a == 0`。 这是正确的，因为它完全遵循定义。 然而，当`n`达到`10^9`，这需要对单个测试用例进行大约十亿次检查，这远远超出了可用时间。 

有用的观察是，许多连续值`x`具有相同的值`floor(x^(1/k))`。 如果`m = floor(x^(1/k))`，那么所有这些数字都位于区间内：`m^k <= x < (m + 1)^k`。 

我们可以查看每个可能的根值，而不是查看每个数字`m`。 在一个区间内，我们只需要计算`m`。 可能的数量`m`价值观是`floor(n^(1/k))`，最多约为 31623，因为最慢的情况是`k = 2`。 

对于固定的`m`，区间为：`[m^k, min(n, (m+1)^k - 1)]`。 

的倍数的个数`m`在此区间内为：`floor(high / m) - floor((m^k - 1) / m)`。 

为了`m >= 1`，这可以直接计算。 下界表达式简化为`m^(k-1) - 1`，因此贡献变为：`floor(high / m) - m^(k-1) + 1`。 

蛮力之所以有效，是因为每个数字都被单独检查，但会失败，因为`n`太大了。 区间观察将所有具有相同根的数字压缩为一次计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n^(1/k) * log k) | O(n^(1/k) * log k) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.如果`k = 1`， 返回`n`立即地。 每个正整数都有自己作为底一阶根，所以每个数字都是好的。 
2. 查找`r = floor(n^(1/k))`使用二分查找。 我们不能使用浮点运算，因为接近幂的值可能会被错误地舍入。 
3. 迭代每个可能的根值`m`从 1 到`r`。 每个`m`代表一个完整的数字块，其底数`k`-次方根等于`m`。 
4. 计算块的右端点为`min(n, (m+1)^k - 1)`。 左端点是`m^k`，以及每个倍数`m`在这个范围内贡献了一个很好的数字。 
5. 添加的倍数`m`在此区间内使用整数除法。 对所有可能的根重复此操作，将每个好数字恰好计数一次。 

该划分正确的原因是每个正整数都恰好有一个值`floor(x^(1/k))`。 区间不重叠，因此一个数字不能被计算两次，并且每个有效数字都出现在属于其根的区间中。 

为什么它有效：该算法在处理所有根值后保持不变量`m`，答案恰好包含所有好数，其底数`k`-th 根最多`m`。 下一个区间仅包含有根的数字`m+1`，并且倍数计数公式完全符合好数的定义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def power_limit(a, b, limit):
    result = 1
    while b:
        if b & 1:
            result *= a
            if result > limit:
                return limit + 1
        b >>= 1
        if b:
            a *= a
            if a > limit:
                a = limit + 1
    return result

def kth_root(n, k):
    if k == 1:
        return n
    lo, hi = 1, n
    ans = 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if power_limit(mid, k, n) <= n:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans

def solve_case(n, k):
    if k == 1:
        return n

    r = kth_root(n, k)
    ans = 0

    for m in range(1, r + 1):
        high = min(n, power_limit(m + 1, k, n) - 1)
        lower_power = power_limit(m, k, n)
        ans += high // m - (lower_power - 1) // m

    return ans

def main():
    t = int(input())
    out = []
    for case in range(1, t + 1):
        n, k = map(int, input().split())
        out.append(f"Case #{case}: {solve_case(n, k)}")
    print("\n".join(out))

if __name__ == "__main__":
    main()
```这`power_limit`使用函数代替 Python 的普通求幂，因为算法只需要知道幂是否超过`n`。 提前停止可以避免在二分搜索期间创建不必要的大整数。 

这`kth_root`函数对可能的根值执行二分搜索。 单调性质来自以下事实：`x^k`增加为`x`增加，所以一旦一个值太大，每个更大的值也太大了。 

里面`solve_case`，每次迭代处理一个根区间。 表达式`high // m - (lower_power - 1) // m`计算的倍数`m`无需遍历区间。 减法使用`lower_power - 1`因为间隔开始于`m^k`，并且我们需要严格计算该点之前的倍数。 

Python整数不会溢出，但是提前截止`power_limit`对于性能来说仍然是必要的，因为诸如`2^1000000000`永远不应该建造。 

## 工作示例

 对于`n = 233, k = 2`，前几个间隔如下所示：

 | 根米| 间隔开始 | 区间结束 | 倍数计数 | 运行答案|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 3 | 3 | 3 |
 | 2 | 4 | 8 | 3 | 6 |
 | 3 | 9 | 15 | 15 3 | 9 |
 | 4 | 16 | 16 24 | 3 | 12 | 12
 | 5 | 25 | 25 35 | 35 2 | 14 | 14

 该算法继续遍历直到 15 的所有根。最终答案是 43，与样本输出匹配。 该跟踪显示我们仅计算每个根块内的倍数，而不是块中的每个数字。 

为了`n = 16, k = 2`:

 | 根米| 间隔开始 | 区间结束 | 倍数计数 | 运行答案|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 3 | 3 | 3 |
 | 2 | 4 | 8 | 3 | 6 |
 | 3 | 9 | 15 | 15 3 | 9 |
 | 4 | 16 | 16 16 | 16 1 | 10 | 10

 最后一个间隔被截断，因为输入限制停止于 16。这证实了上限必须始终被剪裁`n`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^(1/k) * log k) | O(n^(1/k) * log k) | 我们对每个可能的根进行一次迭代，并且每次幂计算都是指数的对数。 |
 | 空间| O(1) | O(1) | 仅存储恒定数量的整型变量。 |

 出现最大根值数时`k = 2`，其中大约为 31623`n = 10^9`。 这使得操作数量对于给定的限制来说足够小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve(inp):
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    if not data:
        return ""

    it = iter(data)
    t = int(next(it))
    ans = []
    for case in range(1, t + 1):
        n = int(next(it))
        k = int(next(it))
        ans.append(f"Case #{case}: {solve_case(n, k)}")
    return "\n".join(ans)

# provided samples
assert solve("""2
233 1
233 2
""") == """Case #1: 233
Case #2: 43""", "sample"

# minimum-size cases
assert solve("""2
1 1
1 100
""") == """Case #1: 1
Case #2: 1""", "minimum values"

# all values are handled by k=1
assert solve("""1
1000000000 1
""") == """Case #1: 1000000000", "k equals one"

# square-root boundary cases
assert solve("""1
16 2
""") == """Case #1: 10""", "perfect power boundary"

# all equal root interval behavior
assert solve("""1
8 2
""") == """Case #1: 6""", "single completed interval"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`1`| 尽可能最小的输入 |
 |`1 100`|`1`| 仅存在根 1 的非常大的指数 |
 |`1000000000 1`|`1000000000`| 特殊处理`k = 1`|
 |`16 2`|`10`| 精确的功率边界处理 |
 |`8 2`|`6`| 计算一个根区间内的倍数 |

 ## 边缘情况

 当`k = 1`，根区间的想法崩溃了，因为每个数字都有自己的根。 算法避免循环并返回`n`，它直接匹配定义。 用于输入`233 1`，它输出`233`。 

当根为1时，下一个幂之前的所有数字都属于第一个区间。 用于输入`5 2`，间隔为`[1, 3]`，并且所有三个值都被计数。 算法从开始迭代`m = 1`，因此包含这些值。 

什么时候`n`在间隔中间结束，则间隔必须缩短。 用于输入`16 2`，根 4 间隔通常是`[16, 24]`，但仅`16`是在允许范围内的。 该算法使用`min(n, (m+1)^k - 1)`，所以它只计算有效部分。 

什么时候`k`很大，根值通常为1。对于输入`1,000,000,000 1000000000`，算法的二分查找很快发现大于1的根的幂都不在限制之内，因此只处理第一个区间。
