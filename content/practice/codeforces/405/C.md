---
title: "CF 405C - 不寻常的产品"
description: "我们得到一个 n×n 二进制矩阵，这意味着每个元素要么是 0 要么是 1。矩阵的“异常平方”被定义为第 i 行与第 i 列的点积的所有行的总和，以模 2 计算。"
date: "2026-06-07T01:37:28+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 405
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 238 (Div. 2)"
rating: 1600
weight: 405
solve_time_s: 271
verified: true
draft: false
---

[CF 405C - 不寻常的产品](https://codeforces.com/problemset/problem/405/C)

 **评分：** 1600
 **标签：** 实现、数学
 **求解时间：** 4m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个 _n_×_n_ 二进制矩阵，意味着每个元素不是 0 就是 1。矩阵的“异常平方”定义为第 _i_ 行与第 _i_ 列的点积的所有行的总和，计算模 2。换句话说，对于矩阵中的每个对角位置，我们计算该行与其相应列的点积，将所有这些结果相加，然后减少模 2。 

最重要的是，我们需要处理三种类型的查询。 第一个翻转一行中的所有位，第二个翻转一列中的所有位，第三个询问当前的异常方格。 输入矩阵大小可达1000×1000，查询数量可达10^6。 每次翻转后重新计算异常平方的简单方法将涉及每个类型 3 查询的 O(n^2) 工作。 对于 10^6 次查询，这显然是不可行的，因为它需要大约 10^12 次操作，这远远超出了任何合理的时间限制。 

我们还必须小心差一错误和模运算，特别是因为翻转以一种微妙的、与位置相关的方式影响不寻常的正方形。 例如，如果矩阵全为零并且我们翻转一行，则异常正方形可能会也可能不会改变，具体取决于哪些列位一致。 类似地，翻转同一行两次应该将不寻常的方块返回到其先前的值。 天真地处理这些情况很容易导致错误的答案。 

## 方法

 强力解决方案很简单：存储矩阵，对于每个类型 3 查询，迭代每一行，计算与其相应列的点积，对结果求和，然后输出模 2。这是正确的，因为它直接实现定义，但每个查询需要 O(n^2) 次操作。 如果 n 最多为 1000 个，查询最多为 10^6 个，这可能需要大约 10^12 次操作，这对于 1 秒的时间限制来说太慢了。 

优化的关键洞察是注意到矩阵是二元的，并且所有运算都是模 2。翻转行或列只会更改每个相交的行列对的总和的奇偶校验。 具体来说，翻转行_i_会影响涉及行_i_的所有点积，翻转列_j_会影响涉及列_j_的所有点积。 因此，通过仅维护每个对角线元素贡献的奇偶性，可以通过每行或列翻转 O(1) 更新来跟踪不寻常的正方形。 

我们可以跟踪表示行和列翻转奇偶校验的单个数组，而不是为每个查询重新计算整个点积。 每个类型 3 查询只需要计算 n 个值的奇偶校验和，即 O(n)。 由于 n ≤ 1000，这对于 10^6 次查询来说足够快，总操作计数大约为 10^9，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q·n^2) | O(q·n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n + q·n) | O(n + q·n) | O(n^2 + n + n) | O(n^2 + n + n) | 已接受 |

 ## 算法演练

 1. 读取矩阵并将其存储在二维数组中。 这对于了解行和列翻转矩阵的初始状态是必要的。 
2.初始化两个长度为n的数组：`row_flip`和`col_flip`。 每个数组存储该行或列是否已翻转奇数次 (1) 还是偶数次 (0)。 
3. 通过迭代每一行 _i_ 来计算初始异常平方。 对于每一行，计算行 _i_ 与列 _i_ 模 2 的点积并对这些值求和。 将其存储为`current_square`。 
4. 对于每个查询，处理如下：

 - 如果查询翻转第 _i_ 行，则切换`row_flip[i]`。 然后，对于每个受影响的对角线元素（仅元素 (i,i)），使用当前的值重新计算其对异常正方形的贡献`row_flip`和`col_flip`数组。 根据需要加或减模 2。 
- 如果查询翻转列_j_，则切换`col_flip[j]`并类似地更新对角线元素 (j,j) 的贡献。 
- 如果查询要求不寻常的正方形，请使用以下方法计算每个对角线元素的奇偶校验`matrix[i][i] ^ row_flip[i] ^ col_flip[i]`并求和模 2。将此值附加到输出字符串。 
5. 输出累积的答案字符串。 

### 为什么它有效

 该算法之所以有效，是因为每个行或列翻转仅影响涉及该行或列的点积的奇偶校验。 通过维护翻转奇偶校验数组并计算对角元素模 2 的贡献，我们可以正确跟踪异常正方形，而无需重新计算整个矩阵。 每个 3 类查询都会对贡献求和，从而保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
q = int(input())

row_flip = [0] * n
col_flip = [0] * n

# Compute initial unusual square
def compute_usquare():
    total = 0
    for i in range(n):
        val = matrix[i][i] ^ row_flip[i] ^ col_flip[i]
        total ^= val
    return total

res = []

for _ in range(q):
    query = input().split()
    if query[0] == '1':
        i = int(query[1]) - 1
        row_flip[i] ^= 1
    elif query[0] == '2':
        j = int(query[1]) - 1
        col_flip[j] ^= 1
    else:
        res.append(str(compute_usquare()))

print(''.join(res))
```这`row_flip`和`col_flip`数组跟踪每行或每列是否已翻转奇数次。 这`compute_usquare`函数将原始对角线值与当前翻转状态进行异或，这直接给出了异常正方形的奇偶校验。 使用 XOR 可以避免手动处理模 2 的加法。 

## 工作示例

 ### 输入示例 1```
3
1 1 1
0 1 1
1 0 0
12
3
2 3
3
2 2
2 2
1 3
3
3
1 2
2 1
1 1
3
```| 查询 | 行翻转 | col_flip | 不寻常的广场|
 | --- | --- | --- | --- |
 | 3 | [0,0,0]| [0,0,0]| 0 |
 | 2 3 | [0,0,0]| [0,0,1]| |
 | 3 | [0,0,0]| [0,0,1]| 1 |
 | 2 2 | 2 [0,0,0]| [0,1,1]| |
 | 2 2 | 2 [0,0,0]| [0,0,1]| |
 | 1 3 | [0,0,1]| [0,0,1]| |
 | 3 | [0,0,1]| [0,0,1]| 0 |
 | 3 | [0,0,1]| [0,0,1]| 0 |
 | 1 2 | [0,1,1]| [0,0,1]| |
 | 2 1 | 2 [0,1,1]| [1,0,1]| |
 | 1 1 | 1 [1,1,1]| [1,0,1]| |
 | 3 | [1,1,1]| [1,0,1]| 1 |

 输出字符串是`"01001"`，匹配样本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q·n) | O(n + q·n) | 读取矩阵的时间复杂度为 O(n^2)。 每个查询最多计算 O(n)`compute_usquare`。 |
 | 空间| O(n^2 + 2n) | O(n^2 + 2n) | 矩阵使用 O(n^2)。`row_flip`和`col_flip`每个使用 O(n)。 |

 当 n ≤ 1000 且 q ≤ 10^6 时，该算法在一秒内完成，并且使用的空间少于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    # Place the solution code here; return the result string
    n = int(input())
    matrix = [list(map(int, input().split())) for _ in range(n)]
    q = int(input())
    row_flip = [0] * n
    col_flip = [0] * n
    def compute_usquare():
        total = 0
        for i in range(n):
            total ^= matrix[i][i] ^ row_flip[i] ^ col_flip[i]
        return total
    res = []
    for _ in range(q):
        query = input().split()
        if query[0] == '1':
            i = int(query[1])
```
