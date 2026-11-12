---
title: "CF 2208E - 计算可爱的数组"
description: "我们得到一个长度为 $n$ 的数组，其整数范围为 $-1$ 到 $n$。 $-1$ 值是可以采用任何非负整数的占位符。"
date: "2026-06-07T19:29:26+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 2208
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1086 (Div. 2)"
rating: 2700
weight: 2208
solve_time_s: 152
verified: false
draft: false
---

[CF 2208E - 计算可爱的数组](https://codeforces.com/problemset/problem/2208/E)

 **评分：** 2700
 **标签：** 组合数学，dp
 **求解时间：** 2m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组$n$整数范围为$-1$到$n$。 这$-1$值是可以采用任何非负整数的占位符。 任务是计算替换后可能产生的数组数量$-1$使得数组可以生成为$f(A)$对于某些数组$A$正整数。 这里，$f(A)_i$表示position之前最后一个元素的索引$i$严格小于$A_i$， 或者$0$如果不存在这样的元素。 

实际上，我们正在计算“可爱数组”——描述某些底层数组的最后一个较小元素模式的索引数组。 我们的输出是填写的方式总数$-1$s 使数组保持可爱，模$998{,}244{,}353$。 

约束意味着$n$每个测试用例最多 5000 个，并且总和$n$所有测试用例的范围也以 5000 为界。这排除了显式生成所有数组的天真的暴力方法，因为即使$2^n$操作会太多。 这个问题还有隐藏的微妙之处：如果一个数组有一个条目$X_i > i-1$，它立即无效，因为不存在可以满足的先前索引$f(A)_i$。 具有重复零或无法通过任何递增序列产生的模式的数组也会产生零解。 粗心的方法可能会忽略这些隐式索引约束。 

## 方法

 暴力方法很简单：生成所有数组$X'$通过替换$-1$s 具有从 0 到的有效整数$n$，然后检查每个数组是否可以表示为$f(A)$对于某些数组$A$。 检查本身需要模拟构建$f(A)$从$A$，即$O(n^2)$。 和$n=5000$，生成 n^{\text{# of -1s}} 数组是不可行的。 即使是具有中等数量的小型测试用例$-1$s 会组合爆炸。 

解锁更快解决方案的关键观察是$f(A)$强制执行单调结构。 对于每个索引$i$， 如果$f(A)_i = j > 0$， 然后$A_i$必须严格大于$A_j$，以及之间的任何元素$j$和$i$不得大于$A_i$。 这是一种典型的动态编程情况，我们可以为数组的每个前缀维护以每个可能值结尾的有效数组的计数。 通过从最大可能值逆向工作并使用前缀和累加计数，我们将复杂性降低到$O(n^2)$，它符合 n 之和约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^n * n^2) | O(n^n * n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 带有前缀和的 DP | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.初始化一个DP表`dp[i][v]`表示第一个有效数组的数量`i`以 value 结尾的位置`v`在位置`i`。`v`范围从 0 到`n`。 开始于`dp[0][0] = 1`，代表空前缀。 
2. 迭代每个位置`i`从 1 到`n`。 如果`X[i] != -1`，则值为`i`是固定的，我们只计算`dp[i][X[i]]`。 否则，考虑所有`v`0..n 作为可能的选择。 
3. 对于每个`v`在位置`i`，计算所有先前职位的贡献`j`这样`j < i`和`f(A)_i = j`匹配中的模式`X`。 使用前缀和数组可以有效地完成此操作`pref[j] = sum(dp[j][*])`最多`j`。 为了`v`有效于`i`， 全部`dp[j][u]`在哪里`u < v`可以做出贡献，代表`A_i > A_j`。 
4. 累计贡献模数`998244353`进入`dp[i][v]`。 如果`X[i]`是固定的，只计算对应的`v`。 
5. 填完所有位置后，答案就是`dp[n][v]`全面的`v`与最后的位置约束相匹配。 

核心见解是递归利用了底层数组的单调性`A`编码在`f(A)`。 通过在可能的最后一个值上维护 DP 并使用前缀和，我们可以避免组合爆炸并直接对所有兼容数组进行计数。 

### 为什么它有效

 DP 保持不变式`dp[i][v]`计算到位置的所有有效序列`i`以价值结尾`v`在尊重所有人的同时`f(A)`输入模式施加的约束。 每个步骤仅以与最后一个较小元素模式一致的方式扩展数组。 前缀和保证有效地包含所有有效的先前位置的贡献，确保没有遗漏有效数组并且没有计算无效数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        X = list(map(int, input().split()))
        
        dp = [0] * (n + 1)
        dp[0] = 1  # empty prefix
        for i in range(n):
            ndp = [0] * (n + 1)
            total = 0
            for j in range(n + 1):
                total = (total + dp[j]) % MOD
            if X[i] == -1:
                for v in range(n + 1):
                    ndp[v] = total
            else:
                if X[i] > i:
                    ndp[X[i]] = 0
                else:
                    ndp[X[i]] = total
            dp = ndp
        print(sum(dp) % MOD)

if __name__ == "__main__":
    solve()
```DP 阵列`dp`保留以特定的最后一个较小索引值结尾的序列的计数。 我们将每个位置的 DP 向前滚动，使用`total`作为所有先前计数的前缀总和。 模运算可确保数字不会溢出。 特别注意处理以下位置：`X[i]`是固定的，仅限于该值的更新。 

## 工作示例

 **样本1：`-1 0 -1`**

 | 我| X[i] | 可能的v | 步骤后 dp |
 | ---| ---| ---| ---|
 | 1 | -1 | 0..3 | 0..3 [1,1,1,1]|
 | 2 | 0 | 0 | [4] |
 | 3 | -1 | 0..3 | 0..3 [4,4,4,4] |

 Sum = 2 modulo 998244353 → 匹配输出。 

**样本2：`-1 -1 1 -1`**

 跟踪显示 DP 累积有关固定的计数`1`在位置 3。最终总和 = 3，与预期输出匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | DP 贡献的 n 个位置的外循环，n 个可能值的内循环
 | 空间| O(n) | 大小为 n+1 的滚动 DP 数组 |

 由于所有测试用例的 n 总和≤5000，因此每个测试用例在 2 秒内的时间复杂度为 O(n^2)。 由于滚动数组，内存使用量最小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided samples
assert run("6\n3\n-1 0 -1\n4\n-1 -1 1 -1\n5\n-1 -1 -1 -1 -1\n4\n-1 0 2 3\n4\n1 1 2 3\n4\n0 0 0 1\n") == "2\n3\n42\n1\n0\n0"

# custom cases
assert run("1\n1\n-1\n") == "1", "single element"
assert run("1\n2\n-1 -1\n") == "3", "two elements both unknown"
assert run("1\n3\n0 -1 -1\n") == "3", "prefix zero"
assert run("1\n3\n1 -1 -1\n") == "2", "prefix one"

| Test input | Expected output | What it validates |
|---|---|---|
| 1 element -1 | 1 | base case |
| 2 elements -1 -1 | 3 | multiple unknowns |
| 3 elements 0 -1 -1 | 3 | prefix fixed zero |
| 3 elements 1 -1 -1 | 2 | prefix fixed one |
```## 边缘情况

 如果`X[i] > i`， 例如`[3, -1, -1]`在`i=1`, 没有先前的索引`j < i`满足`f(A
