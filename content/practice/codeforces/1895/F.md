---
title: "CF 1895F - 花式阵列"
description: "我们正在计算由非负整数组成的长度为 n 的数组。 相邻值最多可以在任一方向上移动 k。 如果至少有一个元素属于区间 $$[x, x+k-1]，则该数组被视为奇特数组。$$ 任务是对所有此类数组以 $10^9+7$ 为模进行计数。"
date: "2026-06-08T21:46:31+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math", "matrices"]
categories: ["algorithms"]
codeforces_contest: 1895
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 157 (Rated for Div. 2)"
rating: 2600
weight: 1895
solve_time_s: 139
verified: true
draft: false
---

[CF 1895F - 花式数组](https://codeforces.com/problemset/problem/1895/F)

 **评分：** 2600
 **标签：** 组合数学、dp、数学、矩阵
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在计算长度的数组`n`由非负整数组成。 相邻值最多可能移动`k`在任一方向。 

如果至少有一个元素属于该区间，则认为数组是奇特的$$[x, x+k-1].$$任务是对所有此类数组进行模数计数$10^9+7$。 

首先看起来不寻常的是数组值在上面是无界的。 对值进行直接动态规划是不可能的，因为值可以任意大。 

约束解释了真正的结构所在。 两个都`n`和`k`可以达到$10^9$，因此任何一个参数的线性都是不可能的。 唯一的小参数是`x`，这最多是`40`。 任何可接受的解决方案都必须将问题减少到状态空间，具体取决于`x`然后使用矩阵求幂来处理巨大的长度。 

一个微妙的点是，仅满足邻接条件的所有数组的集合是无限的，因为值可以无限制地向上移动。 某些元素所在的要求$[x,x+k-1]$是什么让答案变得有限。 

另一个容易犯的错误是尝试直接对包含目标区间值的数组进行计数。 该区间可能会被多次访问，因此位置上的包含-排除变得混乱。 

考虑：```
n = 2, x = 1, k = 1
```有效的数组是：```
[0,1]
[1,0]
[1,1]
[1,2]
[2,1]
```其中有 5 个。 单独计算“首次访问”位置会重复计算多个数组。 

当出现第二个陷阱时`x = 0`。```
n = 1, x = 0, k = 3
```中的每个值`{0,1,2}`已经满足要求，所以答案是`3`。 

以下任何完全减去数组的公式`x`必须正确处理下面没有值的事实`0`。 

## 方法

 让我们首先想象一个暴力解决方案。 

假设值被限制在某个有限范围内。 我们可以枚举每个数组并检查相邻差异是否保持在`k`以及是否至少有一个元素属于目标区间。 这显然是正确的，但即使对于很小的范围，数组的数量也会呈指数增长：$M^n$。 和$n$最多$10^9$，这样的做法是没有希望的。 

关键的观察来自于查看数组的最小值。 

取任意满足邻接条件的数组。 设其最小值为`m`。 

如果我们减去`m`from every element, all differences remain unchanged. 移位数组具有最小`0`。 

现在看看连续元素之间的增量序列。 每个步骤可以是任意整数`[-k,k]`，准确给出`2k+1`的可能性。 

一旦达到最小值`m`并且步骤顺序是固定的，整个数组是唯一确定的。 

这建议按数组的最小值来计数。 

数组是奇特的，当且仅当它的最小值最多是$x+k-1$，并且并非所有元素都严格位于下面`x`。 

事实上，如果最小值超过$x+k-1$，那么每个元素都超过$x+k-1$，因此永远不会达到目标间隔。 

相反，如果最小值最多为$x+k-1$，那么某个元素等于最小值，因此位于$[0,x+k-1]$。 错过目标区间的唯一方法是当每个元素实际上都低于目标区间时`x`。 

这将答案转变为$$(\text{arrays with minimum } \le x+k-1) - (\text{arrays entirely in } [0,x-1]).$$第一个数量变得极其简单。 

选择最小值。 它可以是任意整数`0`到`x+k-1`, 给予`x+k`选择。 

确定最小值后，每个`n-1`差异可以独立选择`[-k,k]`, 给予$$(2k+1)^{n-1}$$的可能性。 

因此$$A=(x+k)(2k+1)^{n-1}.$$第二个量仅涉及以下值`[0,x-1]`。 自从`x ≤ 40`，我们可以对这些状态进行DP。 

让$$dp_i[j]$$是长度的数量-`i`以 value 结尾的数组`j`，所有值都保留在里面`[0,x-1]`。 

过渡是$$dp_i[j] = \sum_{|j-t|\le k} dp_{i-1}[t].$$这是最多 40 个状态的线性变换，因此矩阵求幂计算结果为巨大`n`。 

答案是$$(x+k)(2k+1)^{n-1} - \text{count\_below\_x}.$$这会产生一个$O(x^3\log n)$解决方案。 

其基本思想与官方解决方案中使用的思想完全相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 |$O(x^3\log n)$|$O(x^2)$| 已接受 |

 ## 算法演练

 1. 计算$$T=(x+k)(2k+1)^{n-1}.$$这会计算最小值所属的所有数组`[0, x+k-1]`。 
2. 统计每个值所在的数组`[0,x-1]`。 

让状态成为值`0,1,...,x-1`。 
3. 建立一个`x × x`转移矩阵`M`。`M[i][j] = 1`如果`|i-j| ≤ k`， 否则`0`。 

This exactly matches the adjacency constraint.
 4. Create the initial row vector$$V=[1,1,\dots,1].$$中的每个值`[0,x-1]`可能会作为第一个元素出现。 
5. 计算$$V' = V \cdot M^{\,n-1}.$$矩阵求幂将大指数减少为$O(\log n)$。 
6. 对所有条目求和`V'`。 

这是其值永远不会离开的数组的数量`[0,x-1]`。 
7. 减去该数量`T`。 
8. 输出结果取模$10^9+7$。 

### 为什么它有效

 每个满足邻接条件的数组都有一个唯一的最小值。 

固定最小值和连续差异的顺序唯一地确定了整个数组。 因为每个差异都精确地`2k+1`可能性，具有固定最小值的数组数量等于$(2k+1)^{n-1}$。 

最小值可以取任意值`0`到`x+k-1`，产生$(x+k)(2k+1)^{n-1}$其最小值不超过的数组$x+k-1$。 

其中，唯一不符合奇特条件的数组是那些值都严格低于`x`。 这些数组由矩阵 DP 进行计数。 

这两个集合的区别在于奇特数组的集合，因此减法会产生正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def mat_mul(A, B):
    n = len(A)
    m = len(B[0])
    p = len(B)

    C = [[0] * m for _ in range(n)]

    for i in range(n):
        for k in range(p):
            if A[i][k] == 0:
                continue
            aik = A[i][k]
            for j in range(m):
                C[i][j] = (C[i][j] + aik * B[k][j]) % MOD

    return C

def mat_pow(M, e):
    n = len(M)

    R = [[0] * n for _ in range(n)]
    for i in range(n):
        R[i][i] = 1

    while e:
        if e & 1:
            R = mat_mul(R, M)
        M = mat_mul(M, M)
        e >>= 1

    return R

def solve_case(n, x, k):
    total = (x + k) % MOD
    total = total * pow(2 * k + 1, n - 1, MOD) % MOD

    if x == 0:
        below = 0
    else:
        M = [[0] * x for _ in range(x)]

        for i in range(x):
            for j in range(x):
                if abs(i - j) <= k:
                    M[i][j] = 1

        P = mat_pow(M, n - 1)

        vec = [[1] * x]
        res = mat_mul(vec, P)

        below = sum(res[0]) % MOD

    return (total - below) % MOD

def main():
    t = int(input())
    ans = []

    for _ in range(t):
        n, x, k = map(int, input().split())
        ans.append(str(solve_case(n, x, k)))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    main()
```计算自然地分成两个独立的部分。 

第一部分计算最小值最多为的数组`x+k-1`。 这只是模幂。 

第二部分对下面的数组进行了计数`x`。 自从`x ≤ 40`，状态空间很小。 转换矩阵恰好包含值之间的有效移动。 

初始向量全为 1，因为以下任何值`x`可以选择作为第一个元素。 乘以$M^{n-1}$应用过渡`n-1`次。 

一种微妙的边界情况是`x = 0`。 那么“below x”DP 中根本就没有状态。 数组的数量完全低于`x`简直就是零。 

另一个细节是`n`可以等于`1`。 用指数进行矩阵求幂`0`正确返回单位矩阵，因此代码自然可以处理这种情况。 

## 工作示例

 ### 示例 1

 输入：```
n = 1, x = 4, k = 25
```首先计算大计数。 

| 数量 | 价值|
 | --- | --- |
 | x+k | 29 | 29
 | (2k+1)^(n-1) | (2k+1)^(n-1) | 1 |
 | 总计 | 29 | 29

 现在对下面的数组进行计数`4`。 

| 价值| 可能的第一个元素？ |
 | --- | --- |
 | 0 | 是的 |
 | 1 | 是的 |
 | 2 | 是的 |
 | 3 | 是的 |

 所以：

 | 数量 | 价值|
 | --- | --- |
 | 下面 | 4 |
 | 答案| 29 - 4 = 25 | 29 - 4 = 25 |

 输出：```
25
```这个例子说明了为什么需要进行减法。 第一个公式计算所有最小值`0`到`28`，但最小值`0..3`对应于从不触及目标区间的数组。 

### 示例 2

 输入：```
n = 3, x = 0, k = 1
```| 数量 | 价值|
 | --- | --- |
 | x+k | 1 |
 | (2k+1)^(n-1) | (2k+1)^(n-1) | 3^2 = 9 | 3^2 = 9
 | 总计 | 9 |

 自从`x=0`, 下面没有值`x`。 

| 数量 | 价值|
 | --- | --- |
 | 下面 | 0 |
 | 答案| 9 |

 输出：```
9
```这演示了特殊情况，其中每个有效最小值都已位于目标区间内。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(x^3 \log n)$| 矩阵求幂`x × x`矩阵|
 | 空间|$O(x^2)$| 存储矩阵 |

 自从`x ≤ 40`，矩阵维数永远不会超过 40。即使$40^3$矩阵乘法很小，并且仅$O(\log n)$他们中的一些人是需要的。 该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    MOD = 1000000007

    def mat_mul(A, B):
        n = len(A)
        m = len(B[0])
        p = len(B)

        C = [[0] * m for _ in range(n)]

        for i in range(n):
            for k in range(p):
                if A[i][k] == 0:
                    continue
                for j in range(m):
                    C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD
        return C

    def mat_pow(M, e):
        n = len(M)
        R = [[0] * n for _ in range(n)]
        for i in range(n):
            R[i][i] = 1

        while e:
            if e & 1:
                R = mat_mul(R, M)
            M = mat_mul(M, M)
            e >>= 1
        return R

    data = io.StringIO(inp)
    t = int(data.readline())
    out = []

    for _ in range(t):
        n, x, k = map(int, data.readline().split())

        total = (x + k) % MOD
        total = total * pow(2 * k + 1, n - 1, MOD) % MOD

        if x == 0:
            below = 0
        else:
            M = [[0] * x for _ in range(x)]
            for i in range(x):
                for j in range(x):
                    if abs(i - j) <= k:
                        M[i][j] = 1

            P = mat_pow(M, n - 1)
            res = mat_mul([[1] * x], P)
            below = sum(res[0]) % MOD

        out.append(str((total - below) % MOD))

    return "\n".join(out)

# provided sample
assert run(
"""4
3 0 1
1 4 25
4 7 2
1000000000 40 1000000000
"""
) == """9
25
582
514035484"""

# minimum size
assert run("1\n1 0 1\n") == "1"

# x = 0 boundary
assert run("1\n1 0 3\n") == "3"

# single-element interval starting above zero
assert run("1\n1 1 1\n") == "1"

# all values below x excluded
assert run("1\n1 2 1\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 1`|`1`| 尽可能小的实例 |
 |`1 0 3`|`3`|`x=0`特殊处理|
 |`1 1 1`|`1`| 单一目标值|
 |`1 2 1`|`1`| 正确减去下面的值`x`|

 ## 边缘情况

 考虑：```
1
1 0 3
```目标区间为`[0,2]`。 每个有效数组都有一个元素，并且该元素必须是以下之一`0,1,2`。 公式给出$$(0+3)\cdot 1 = 3.$$下面完全没有数组`0`，因此减法项为零。 算法返回`3`。 

现在考虑：```
1
1 4 25
```第一个公式计算所有最小值`0`通过`28`, 给予`29`。 其中，价值观`0,1,2,3`永远达不到目标间隔`[4,28]`。 矩阵 DP 精确计算这四个数组，答案变为`25`。 

最后，考虑：```
1
2 1 1
```间隔为`[1,1]`。 公式给出$$2 \cdot 3 = 6.$$下面的DP`x`只有状态`0`，并且那里正好有一个长度为 2 的数组，即`[0,0]`。 减去它得到`5`，与直接枚举匹配。 这证实了矩阵 DP 精确地删除了非花哨的数组，而没有删除任何其他内容。
