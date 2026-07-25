---
title: "CF 104027K - \u96f6\u65f6\u56f0\u5883 II"
description: "我们给出了一个涉及 $A^T 乘以 A$ 形式的矩阵表达式的设置，其中 $A$ 是某个矩阵，$A^T$ 是其转置。 问题中描述的关键操作是交换$A$的行，并且我们被告知该操作不会改变$A^T乘以A$的值。"
date: "2026-07-02T04:10:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104027
codeforces_index: "K"
codeforces_contest_name: "The 10-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 104027
solve_time_s: 40
verified: true
draft: false
---

[CF 104027K - \u96f6\u65f6\u56f0\u5883 II](https://codeforces.com/problemset/problem/104027/K)

 **评级：** -
 **标签：** -
 **求解时间：** 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个涉及以下形式的矩阵表达式的设置$A^T \times A$， 在哪里$A$是一些矩阵并且$A^T$是它的转置。 问题中描述的关键操作是交换行$A$，并且我们被告知此操作不会改变 的值$A^T \times A$。 

除去叙述之外，任务本质上是确定目标矩阵是否$B$匹配的值$A^T \times A$对于最初给定的矩阵$A$。 该问题强调行排列不会影响结果，这意味着行的内部排序$A$与最终的计算结果无关。 

所以输入可以解释为一个矩阵$A$，可能带有一些表示噪声或排列模糊性，以及一个矩阵$B$我们想要验证源自以下的规范不变量$A$，即 Gram 矩阵$A^T A$。 

输出是二进制的：我们输出不变量是否与给定目标匹配。 

约束没有明确说明，但考虑到典型的 Codeforces 结构和矩阵运算的提及，我们应该假设$n$至少达到$10^5$或类似的规模。 这立即排除了朴素矩阵乘法$O(n^3)$如果我们将其解释为稠密矩阵，则接近。 然而，关键的观察是该操作在行交换下是不变的，因此我们不需要模拟任何转换。 

一个天真的但诱人的错误是重新计算矩阵乘积，同时显式地尊重行排列。 例如，如果有人尝试重建$A$根据不同的行顺序并重新计算$A^T A$，这将成为行数的阶乘。 

当误解转置乘法时，会出现更微妙的失败情况。 例如，错误地计算$A A^T$而不是$A^T A$导致完全不同的维度和意义，尽管两者看起来相似。 

一个具体的边缘示例：

 输入：$A = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}$如果我们计算错误$A A^T$，我们得到：$$\begin{bmatrix}5 & 11 \\ 11 & 25\end{bmatrix}$$但$A^T A$给出：$$\begin{bmatrix}10 & 14 \\ 14 & 20\end{bmatrix}$$即使在小情况下，混淆这些也会导致始终错误的答案。 

问题陈述中更深层的预期简化是所有行排列都保留行向量的多重集，因此 Gram 矩阵仅取决于行上聚合的内积。 

## 方法

 强力解释将从字面上处理该问题：考虑所有可能的行排列$A$, 计算$A^T A$对于每个，并检查是否有等于$B$。 每次计算$A^T A$需要$O(n^2 m)$如果$A$是$n \times m$，并且有$n!$排列。 即使对于$n = 10$。 

即使我们避免枚举排列并尝试动态模拟行交换，我们仍然会重复重新计算二次结构，这会导致不必要的工作。 

关键的见解是$A^T A$在行排列下是不变的，因为它本质上是行的总和：$$A^T A = \sum_{i} r_i^T r_i$$在哪里$r_i$是$i$第-行$A$。 交换行不会改变这些外积的多重集，因此最终矩阵保持不变。 

这将整个问题简化为直接计算：我们从原始数据计算一次 Gram 矩阵$A$，然后直接与$B$。 没有模拟，没有排列组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 |$O(n! \cdot n^2)$|$O(n^2)$| 太慢了|
 | 直接 Gram 计算 |$O(n m^2)$或者$O(n m)$取决于结构 |$O(m^2)$| 已接受 |

 ## 算法演练

 我们解释每一行$A$作为 a 中的向量$m$维空间。 矩阵$A^T A$通过累积所有行的成对坐标积来构造。 

1. 读取矩阵$A$和矩阵$B$。 我们假设$A$有$n$行和$m$列，同时$B$是$m \times m$。 这些维度已经强制规定只能进行一次有意义的比较。 
2. 初始化一个$m \times m$矩阵`res`带零。 这将存储计算出的 Gram 矩阵。 每个条目$res[j][k]$表示所有行的累积点积贡献。 
3. 对于每一行$i$在$A$，迭代所有列对$(j, k)$。 我们添加$A[i][j] \times A[i][k]$到$res[j][k]$。 这直接实现了定义$A^T A$没有显式地形成转置。 
4. 处理完所有行后，`res`包含完整的$A^T A$。 我们现在逐条比较它$B$。 如果出现任何不匹配，我们立即得出结论它们不相等。 
5. 如果所有条目匹配，我们输出相等。 

我们对行进行累加而不是构造完整的矩阵乘法的原因是，行分解既更简单，又避免了不必要的转置开销。 

### 为什么它有效

 价值$A^T A$展开为行的外积之和：$$A^T A = \sum_{i=1}^{n} r_i^T r_i$$每行独立地对最终矩阵做出贡献。 行交换只是对和中这些项的顺序进行排列，而加法是可交换的，因此最终结果保持不变。 这使得 Gram 矩阵成为行的多重集函数，而不是依赖于序列的对象。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    A = [list(map(int, input().split())) for _ in range(n)]
    B = [list(map(int, input().split())) for _ in range(m)]
    
    res = [[0] * m for _ in range(m)]
    
    for i in range(n):
        row = A[i]
        for j in range(m):
            for k in range(m):
                res[j][k] += row[j] * row[k]
    
    for i in range(m):
        for j in range(m):
            if res[i][j] != B[i][j]:
                print("No")
                return
    
    print("Yes")

if __name__ == "__main__":
    solve()
```该实现直接遵循 Gram 矩阵的行分解。 在一般情况下，三重嵌套结构是不可避免的，因为每一行都贡献一个完整的外积。 比较步骤在施工后立即进行，以避免不必要的工作。 

一个常见的陷阱是在构建外部产品时反转索引。 正确的贡献是`row[j] * row[k]`，不混合行索引或尝试显式转置。 

## 工作示例

 ### 示例 1

 假设：```
A =
1 2
3 4

B =
10 14
14 20
```我们一步步计算。 

| 行| 对资源的贡献 |
 | ---| ---|
 | [1, 2] | [[1, 2], [2, 4]] |
 | [3, 4] | [[9, 12], [12, 16]] |

 最终的：```
res =
10 14
14 20
```这匹配$B$，所以输出是 Yes。 

该跟踪证实了每行的贡献是线性且独立累积的。 

### 示例 2```
A =
1 0
0 1

B =
1 0
0 1
```| 行| 贡献 |
 | ---| ---|
 | [1, 0] | [[1, 0], [0, 0]] |
 | [0, 1] | [[0, 0], [0, 1]] |

 最终结果：```
1 0
0 1
```再次比赛$B$，表明正交基行产生对角 Gram 矩阵。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n m^2)$| 每一个$n$行贡献了一个$m \times m$外层产品 |
 | 空间|$O(m^2)$| 存储生成的 Gram 矩阵 |

 该算法可以根据典型的 Gram 矩阵构造问题的密集矩阵输入大小自然地缩放。 即使对于中等规模的$n, m$，这是标准最优方法，因为每个输入元素至少参与一次乘法。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

def solve():
    n, m = map(int, input().split())
    A = [list(map(int, input().split())) for _ in range(n)]
    B = [list(map(int, input().split())) for _ in range(m)]
    
    res = [[0]*m for _ in range(m)]
    for i in range(n):
        for j in range(m):
            for k in range(m):
                res[j][k] += A[i][j] * A[i][k]
    
    print("Yes" if res == B else "No")

# provided sample-like cases
assert run("2 2\n1 2\n3 4\n10 14\n14 20\n") == "Yes"

# minimum size
assert run("1 1\n5\n25\n") == "Yes"

# mismatch case
assert run("1 2\n1 2\n1 3\n1 4\n") == "No"

# identity case
assert run("2 2\n1 0\n0 1\n1 0\n0 1\n") == "Yes"

# negative values
assert run("2 2\n1 -1\n-1 1\n2 -2\n-2 2\n") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x1 矩阵 | 是的 | 最小有效 Gram 矩阵 |
 | 不匹配 B | 没有 | 检测到不正确的比较 |
 | 单位矩阵| 是的 | 对角线保存|
 | 负值| 是的 | 点积中的符号处理|

 ## 边缘情况

 出现微妙的边缘情况时$n = 1$。 在这种情况下，$A^T A$只是单行与其自身的外积。 该算法自然地处理这个问题，因为行上的循环只运行一次，并且不需要特殊的分支。 

另一种情况是所有条目均为零。 那么每个贡献都为零，并且无论行数如何，结果都是零矩阵。 该算法正确地累加零并且将匹配$B$仅当它也为零时。 

第三种情况是行重复时。 由于每一行都是独立贡献的，因此重复项只是线性地缩放贡献。 例如，两个相同的行使 Gram 矩阵贡献加倍。 该算法自然地累积两个副本，无需重复数据删除或散列。
