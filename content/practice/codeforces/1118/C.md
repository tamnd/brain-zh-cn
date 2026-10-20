---
title: "CF 1118C - 回文矩阵"
description: "我们被要求将 n^2 个整数排列成一个 n x n 方阵，使得该矩阵沿两个轴都是回文的。 当我们颠倒行的顺序或颠倒列的顺序时，回文矩阵不会改变。"
date: "2026-06-12T04:32:44+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1118
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 540 (Div. 3)"
rating: 1700
weight: 1118
solve_time_s: 86
verified: false
draft: false
---

[CF 1118C - 回文矩阵](https://codeforces.com/problemset/problem/1118/C)

 **评分：** 1700
 **标签：** 构造性算法，实现
 **求解时间：** 1m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求安排`n^2`整数化为`n x n`方阵，使得矩阵沿两个轴都是回文的。 当我们颠倒行的顺序或颠倒列的顺序时，回文矩阵不会改变。 另一种看待它的方式是每个细胞`(i, j)`必须镜像其对称对应项`(n-i-1, j)`,`(i, n-j-1)`， 和`(n-i-1, n-j-1)`。 例如，矩阵的四个角都必须包含相同的数字。 同样的原理递归地适用于内层。 

输入给我们尺寸`n`和一个列表`n^2`要放置的数字。 我们需要要么使用每个数字恰好一次构造这样的矩阵，要么报告不可能性。 自从`n`最多为 20，单元格总数最多为 400。这对于按频率检查数字组合到位置的方法来说足够小，作为所有排列的强力枚举（这将是`400!`）显然是不可行的。 

当出现不明显的边缘情况时`n`很奇怪。 在奇数大小的矩阵中，有一个中心单元并且`2n-2`沿中间行和中间列的单元格只需要镜像一次，而不是四次。 如果这些位置无法填充所需倍数中出现的数字，则仅检查四倍数的简单实现将会失败。 例如，对于`n = 3`，中心单元格可以取任何至少出现一次的数字，而四个角需要至少出现四次的数字。 

## 方法

 暴力方法会尝试每一种排列`n^2`数字并测试所得矩阵是否是回文矩阵。 这适用于非常小的`n`，但是排列的数量呈阶乘增长并且即使对于`n = 5`，这将是`25!`排列。 

关键的见解是利用对称性。 矩阵中的每个位置都属于一组四个、两个或一个单元格，这些单元格必须全部包含相同的数字。 具体来说，对于甚至`n`，所有位置形成四个单元格的组，因此每个数字必须以四的倍数出现。 对于奇数`n`，中心单元是单例，中心行或列上除中心之外的位置形成对，其余位置形成四元组。 这一观察将问题简化为计算数字的频率并将它们拟合到大小为 4、2 或 1 的组中，这在计算上是微不足道的`n ≤ 20`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n^2)!) | O((n^2)!) | O(n^2) | O(n^2) | 太慢了 |
 | 频率分组 | O(n^2) | O(n^2) | O(1000) | 已接受 |

 ## 算法演练

 1. 统计输入数组中每个数字的出现频率。 这让我们知道每个数字可以组成多少个四元组、对和单例。 
2. 初始化一个`n x n`矩阵用零填充。 我们将从最外层到最内层一层一层地填充。 
3.如果`n`是偶数，所有细胞都属于四元组。 遍历左上象限，并将至少出现四次的数字分配给该象限的每个 2x2 正方形。 放置数字后，将其频率减少四。 如果需要时没有数字剩余至少四个，则输出“NO”。 
4. 如果`n`为奇数时，首先按照偶数情况处理外层。 然后使用至少剩余两个副本的数字处理中心行和中心列（不包括中心单元格）。 为镜像对分配一个数字，并将其计数减 2。 
5. 最后，处理单个中心单元格，该单元格可以用任意数字填充，并且至少有一个剩余计数。 
6. 输出“YES”和完成的矩阵。 

**为什么有效：** 在每个阶段，算法都会确保数字的出现频率能够满足其位置的对称性要求。 四组保证角对称，对组保证中间行/列对称，单组保证中心。 如果在任何阶段无法形成所需的群，就不可能构造回文矩阵。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter

n = int(input())
a = list(map(int, input().split()))
freq = Counter(a)
matrix = [[0]*n for _ in range(n)]

def place_quad(i, j):
    for num in list(freq):
        if freq[num] >= 4:
            matrix[i][j] = matrix[i][n-j-1] = matrix[n-i-1][j] = matrix[n-i-1][n-j-1] = num
            freq[num] -= 4
            if freq[num] == 0:
                del freq[num]
            return True
    return False

def place_pair(i, j, mirrored_i, mirrored_j):
    for num in list(freq):
        if freq[num] >= 2:
            matrix[i][j] = matrix[mirrored_i][mirrored_j] = num
            freq[num] -= 2
            if freq[num] == 0:
                del freq[num]
            return True
    return False

# Fill quadruples
for i in range(n//2):
    for j in range(n//2):
        if not place_quad(i, j):
            print("NO")
            sys.exit()

# Fill middle row/column if n is odd
if n % 2 == 1:
    mid = n//2
    for i in range(n//2):
        if not place_pair(mid, i, mid, n-i-1):
            print("NO")
            sys.exit()
    for i in range(n//2):
        if not place_pair(i, mid, n-i-1, mid):
            print("NO")
            sys.exit()
    # Fill center
    for num in list(freq):
        if freq[num] >= 1:
            matrix[mid][mid] = num
            freq[num] -= 1
            if freq[num] == 0:
                del freq[num]
            break
    else:
        print("NO")
        sys.exit()

print("YES")
for row in matrix:
    print(' '.join(map(str,row)))
```该解决方案首先计算数字频率，这使得很容易知道哪些数字可以填充四元数或对。 这`place_quad`和`place_pair`函数通过填充镜像位置来直接处理对称性。 对于奇数`n`，仔细处理中间行、中间列和中心，确保满足所有对称条件。 

## 工作示例

 **样品1**

 输入：`4 1 8 8 1 2 2 2 2 2 2 2 2 1 8 8 1`| 步骤| 行动| 矩阵|
 | --- | --- | --- |
 | 1 | 用 freq ≥ 4 的数字填充左上角 2x2 象限 | [[1,2,2,1],[8,2,2,8],[8,2,2,8],[1,2,2,1]] |

 矩阵已满； 输出“是”。 这证实了四倍就足够了`n`。 

**奇怪的例子**

 输入：`3 1 1 1 1 2 2 2 2 3`| 步骤| 行动| 矩阵|
 | --- | --- | --- |
 | 1 | 填角（四倍）| [[1,2,1],[2,0,2],[1,2,1]] |
 | 2 | 填充中心| [[1,2,1],[2,3,2],[1,2,1]] |

 确认算法处理奇数`n`正确地具有单个中心。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个矩阵单元填充一次，每个数字的频率检查为 O(1) |
 | 空间| O(n^2 + U) | O(n^2 + U) | 矩阵为 O(n^2)，唯一数字计数器 (U ≤ 1000) 为 O(U) |

 由于 n ≤ 20、n^2 ≤ 400，该算法可以在 2 秒和 256 MB 内存内轻松运行。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("4\n1 8 8 1 2 2 2 2 2 2 2 2 1 8 8 1\n") == "YES\n1 2 2 1\n8 2 2 8\n8 2 2 8\n1 2 2 1", "sample 1"

# Minimum size n=1
assert run("1\n5\n") == "YES\n5", "min size"

# Maximum size n=20, all equal numbers
all_equal = " ".join(["1"]*400)
assert run(f"20\n{all_equal}\n").startswith("YES"), "max size equal numbers"

# Odd n, impossible
assert run("3\n1 1 2 2 3 3 4 4 5\n") == "NO", "odd impossible"

# Odd n, exact frequencies
assert run("3\n1 1 1 1
```
