---
title: "CF 258C - 小象和LCM"
description: "给定一个数组a。 对于每个位置 i，我们必须选择一个整数 bi，使得 1 ≤ bi ≤ ai。 当序列 b 的最小公倍数等于其最大元素时，称为良好序列。"
date: "2026-06-04T17:29:36+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "combinatorics", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 258
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 157 (Div. 1)"
rating: 2000
weight: 258
solve_time_s: 231
verified: true
draft: false
---

[CF 258C - 小象和 LCM](https://codeforces.com/problemset/problem/258/C)

 **评级：** 2000
 **标签：** 二分查找、组合数学、dp、数学
 **求解时间：** 3m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数组`a`。 对于每个职位`i`，我们必须选择一个整数`b_i`这样`1 ≤ b_i ≤ a_i`。 

一个序列`b`当它的最小公倍数等于它的最大元素时，称为好的。 

与其直接计算好的序列，不如考虑两个数量必须共享的值更有用。 如果$$\operatorname{lcm}(b_1,\dots,b_n)=\max(b_1,\dots,b_n)=m,$$那么每个选定的值必须除以`m`，否则 LCM 将变得大于`m`。 同时，至少有一个位置必须恰好包含`m`，否则最大值将小于`m`。 

任务是计算所有有效序列`b`满足规定的上限`a`, 取模$10^9+7$。 

约束完全决定了解的形状。 我们最多有$10^5$职位，以及每一个`a_i`至多是$10^5$。 任何以二次方式一起处理位置和值的算法都是不可能的。 甚至$10^5 \times 10^5$操作将远远超出限制。 的小值界$10^5$是关键观察。 它建议计算有多少数组元素落入值范围，然后迭代可能的最大值。 

一些边缘情况很容易被错误处理。 

考虑```
1
1
```唯一可能的顺序是`[1]`。 其 LCM 和最大值均为`1`，所以答案是`1`。 任何涉及“真因数”的公式都必须处理`1`小心，因为它没有适当的正因数。 

考虑```
2
2 2
```好的序列是```
(1,1)
(1,2)
(2,1)
(2,2)
```总共为`4`。 一个常见的错误是只计算最大值等于的序列`2`，忘记最大值`1`也是可以的。 

考虑```
2
1 100000
```第一个位置被迫为`1`。 第二个位置可以有很多值。 任何假设所有职位都具有相似自由度的方法都会多算。 每个候选最大值的贡献取决于有多少个索引实际上可以达到它。 

## 方法

 最直接的方法就是枚举每一个可能的序列`b`，计算其 LCM 和最大值，并检查它们是否匹配。 

这是正确的，因为它确实遵循定义。 不幸的是，即使所有`a_i = 10`, 已经有$10^n$可能的序列。 和$n = 10^5$，暴力破解是没有希望的。 

下一个想法是修复共同值$$m=\operatorname{lcm}(b)=\max(b).$$对于固定的`m`，每个选定的值必须是以下的除数`m`。 此外，至少一个选定的值必须准确无误`m`。 

现在问题变成了在除数约束下计算赋值。 

假设我们知道所有的约数`m`按递增顺序：$$d_1 < d_2 < \dots < d_k=m.$$对于限制为`x`，允许的选择数量等于除数的数量`m`不超过`x`。 

这将问题转换为计数的乘积。 

剩下的挑战是针对每个人有效地评估这些产品`m ≤ 100000`。 

关键的观察是除数的数量不超过`x`仅当`x`与除数相交`m`。 

如果$$d_r \le x < d_{r+1},$$那么正是`r`的约数`m`可用。 

我们不是单独处理每个数组位置，而是计算有多少个`a_i`落入连续除数之间的每个区间。 因为所有的值最多都是`100000`，前缀频率数组让我们可以在恒定时间内获得这些计数。 

所有整数中除数出现的总数`100000`是$$\sum_{i=1}^{100000}\tau(i)\approx 1.17\times10^6,$$这很容易管理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数为`n`| O(n) | 太慢了|
 | 最佳 | O(M log M) 其中`M = max(a)`| O(M log M) | O(M log M) | 已接受 |

 ## 算法演练

 1. 读取数组并计算值的频率表。 
2. 构建前缀计数数组`pref`， 在哪里`pref[x]`等于索引的数量`a_i ≤ x`。 
3. 预先计算每个整数的除数列表，直到`100000`使用除数筛。 
4.让`m`是 LCM 和最大值的候选值。 
5. 获取排序后的约数`m`：$$d_1<d_2<\dots<d_k=m.$$6. 对于每个间隔$$[d_r,\ d_{r+1}-1],$$计算其中有多少个数组元素：$$E_r = \text{pref}[d_{r+1}-1] - \text{pref}[d_r-1].$$每个这样的位置都有确切的`r`的可用除数`m`。 
7. 乘法$$\prod_{r=1}^{k-1} r^{E_r}.$$这计算了上限低于以下的所有位置的选择`m`。 
8.让$$C=n-\text{pref}[m-1].$$这些正是与`a_i ≥ m`。 

他们每个人都可以使用任何`k`的约数`m`。 
9. 在这些赋值中，减去那些从不使用除数的赋值`m`。 

有效分配的数量为$$k^C-(k-1)^C.$$这是标准的包含-排除步骤。 
10. 将步骤 7 的结果乘以步骤 9 的结果，并将其添加到全局答案中。 
11. 对每个重复`m`从`1`到`100000`。 

### 为什么它有效

 固定一个值`m`。 

每个好的序列，其 LCM 和最大值等于`m`必须满足两个条件。 每个元素都必须整除`m`，否则 LCM 超过`m`。 至少有一个元素必须等于`m`，否则最大值小于`m`。 

区间分解精确计算有多少个约数`m`每个位置都可用。 间隔内的乘积使用除数对所有分配进行计数`m`。 因素$$k^C-(k-1)^C$$精确保留至少一个位置使用除数的那些赋值`m`。 

每个好的序列都恰好有一个值`m`，即其常见的LCM和最大值。 不同的值`m`生成不相交的序列集。 对所有贡献进行求和，将每个好的序列恰好计数一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 1000000007
MAXV = 100000

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    freq = [0] * (MAXV + 1)
    for x in a:
        freq[x] += 1

    pref = [0] * (MAXV + 1)
    for i in range(1, MAXV + 1):
        pref[i] = pref[i - 1] + freq[i]

    divisors = [[] for _ in range(MAXV + 1)]
    for d in range(1, MAXV + 1):
        for multiple in range(d, MAXV + 1, d):
            divisors[multiple].append(d)

    max_tau = max(len(divisors[i]) for i in range(1, MAXV + 1))

    pw = [None] * (max_tau + 1)
    pw[0] = array('I', [0] * (n + 1))

    for base in range(1, max_tau + 1):
        arr = array('I', [0] * (n + 1))
        arr[0] = 1
        for e in range(1, n + 1):
            arr[e] = (arr[e - 1] * base) % MOD
        pw[base] = arr

    ans = 0

    for m in range(1, MAXV + 1):
        ds = divisors[m]
        k = len(ds)

        cur = 1

        for r in range(1, k):
            left = ds[r - 1]
            right = ds[r] - 1

            cnt = pref[right] - pref[left - 1]
            cur = (cur * pw[r][cnt]) % MOD

        c = n - pref[m - 1]

        add = pw[k][c]
        if k > 1:
            add -= pw[k - 1][c]

        cur = (cur * add) % MOD
        ans += cur

    print(ans % MOD)

if __name__ == "__main__":
    solve()
```频率数组和前缀数组使我们能够在恒定时间内回答范围计数查询。 连续除数之间的每个间隔都变成两个前缀值的简单减法。 

除数筛为标准$$O(M \log M)$$建造。 每个整数都被插入到其倍数的除数列表中。 

功效表按除数等级而非值进行索引。 任意数字的约数个数，最多`100000`永远不会超过`128`，因此只需预先计算少量碱基。 这可以避免在主循环内执行超过一百万次模幂运算。 

最微妙的部分是因素$$k^C-(k-1)^C.$$它对至少一个位置使用除数的赋值进行计数`m`。 忘记这个减法会计算出许多序列，其最大值实际上小于`m`。 

另一个微妙的情况是`m = 1`。 然后`k = 1`，减法项应为零。 代码单独处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
4
1 4 3 2
```从概念上排序后，上限分布为：

 | 价值| 计数 |
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 1 |
 | 4 | 1 |

 为了`m = 2`：

 除数是`[1, 2]`。 

| 间隔 | 可用除数计数 | 区间 | 中的元素
 | --- | --- | --- |
 | [1,1]| 1 | 1 |
 | ≥ 2 | 由 C 处理 | 3 |

 因此$$1^1 \cdot (2^3-1^3)=7.$$为了`m = 3`：

 | 间隔 | 可用除数计数 | 元素|
 | --- | --- | --- |
 | [1,2]| 1 | 2 |
 | ≥ 3 | 由 C 处理 | 2 |

 贡献：$$1^2 \cdot (2^2-1^2)=3.$$为了`m = 4`：

 除数`[1,2,4]`。 

| 间隔 | 计数 |
 | --- | --- |
 | [1,1]| 1 |
 | [2,3]| 2 |
 | ≥4 | 1 |

 贡献：$$1^1\cdot2^2\cdot(3^1-2^1)=4.$$将所有贡献相加得出`15`。 

这个例子表明，不同的值`m`独立贡献并简单求和。 

### 示例 2

 输入：```
2
2 2
```为了`m = 1`：

 | 数量 | 价值|
 | --- | --- |
 | C | 2 |
 | 贡献|$1^2 = 1$|

 为了`m = 2`：

 | 数量 | 价值|
 | --- | --- |
 | C | 2 |
 | 贡献|$2^2-1^2=3$|

 总答案：$$1+3=4.$$计算出的四个序列正好是```
(1,1)
(1,2)
(2,1)
(2,2)
```这证实了包含-排除步骤。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(M log M) | O(M log M) | 除数筛加上处理所有除数出现 |
 | 空间| O(M log M) | O(M log M) | 除数列表和幂表的存储 |

 这里`M = 100000`。 

除数出现的总数`100000`大致是`1.17 million`，这使主循环舒适地保持在限制范围内。 内存使用量也符合 256 MB 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from array import array

    MOD = 1000000007
    MAXV = 100000

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    freq = [0] * (MAXV + 1)
    for x in a:
        freq[x] += 1

    pref = [0] * (MAXV + 1)
    for i in range(1, MAXV + 1):
        pref[i] = pref[i - 1] + freq[i]

    divisors = [[] for _ in range(MAXV + 1)]
    for d in range(1, MAXV + 1):
        for m in range(d, MAXV + 1, d):
            divisors[m].append(d)

    max_tau = max(len(divisors[i]) for i in range(1, MAXV + 1))

    pw = [None] * (max_tau + 1)
    pw[0] = array('I', [0] * (n + 1))

    for base in range(1, max_tau + 1):
        arr = array('I', [0] * (n + 1))
        arr[0] = 1
        for e in range(1, n + 1):
            arr[e] = (arr[e - 1] * base) % MOD
        pw[base] = arr

    ans = 0

    for m in range(1, MAXV + 1):
        ds = divisors[m]
        k = len(ds)

        cur = 1

        for r in range(1, k):
            cnt = pref[ds[r] - 1] - pref[ds[r - 1] - 1]
            cur = (cur * pw[r][cnt]) % MOD

        c = n - pref[m - 1]

        add = pw[k][c]
        if k > 1:
            add -= pw[k - 1][c]

        ans = (ans + cur * add) % MOD

    return str(ans) + "\n"

# provided sample
assert run("4\n1 4 3 2\n") == "15\n"

# minimum size
assert run("1\n1\n") == "1\n"

# all equal
```
