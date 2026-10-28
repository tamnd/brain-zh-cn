---
title: "CF 1475F - 不寻常的矩阵"
description: "给定两个相同大小的二进制方阵，称为 a 和 b。 每个元素要么是 0，要么是 1。允许的操作是翻转整行或翻转整列，其中翻转意味着将每个元素与 1 进行异或。"
date: "2026-06-11T00:10:34+07:00"
tags: ["codeforces", "competitive-programming", "2-sat", "brute-force", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1475
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 697 (Div. 3)"
rating: 1900
weight: 1475
solve_time_s: 123
verified: true
draft: false
---

[CF 1475F - 异常矩阵](https://codeforces.com/problemset/problem/1475/F)

 **评级：** 1900
 **标签：** 2-sat、暴力破解、构造性算法
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定两个相同大小的二进制方阵，称为`a`和`b`。 每个元素要么是 0，要么是 1。允许的操作是翻转整行或翻转整列，其中翻转意味着将每个元素与 1 进行异或。我们的任务是确定是否可以进行变换`a`进入`b`使用这些行和列翻转的任意顺序。 

输入指定多个测试用例，每个测试用例给出矩阵的大小以及两个矩阵本身。 如果存在使矩阵相等的翻转序列，则输出应为“YES”，否则输出应为“NO”。 

驱动算法设计的主要约束是`n`最多可达 1000 个，总和`n`所有测试用例的数量不超过 1000。这意味着 O(n^3) 强力解决方案会太慢，因为 1000^3 = 10^9 次操作。 O(n^2) 方法是可行的，因为我们可以在几秒钟内处理总大小大约为 10^6 个元素的矩阵。 

一个微妙的边缘情况是矩阵大小为 1x1 或 2x2 时。 例如，单元素矩阵只能在其行中翻转一次，在其列中翻转一次，因此我们必须确保我们的解决方案正确考虑奇偶校验。 另一个棘手的情况是当行和列需要交替翻转时； 贪婪地翻转一切的幼稚方法可能会产生不可能的中间状态并错误地得出“否”的结论。 

## 方法

 最直接的方法是尝试所有可能的行和列翻转序列，但行有 2^n 种可能的翻转，列有 2^n 种可能的翻转。 尝试所有组合都会导致 O(2^(2n) * n^2) 运算，对于 n ≥ 20，速度呈指数级缓慢。这种强力方法在理论上有效，因为每次翻转要么更改一个单元格，要么不更改单元格，因此每个配置都是可达的，但对于大型矩阵，它在实践中会失败。 

关键的见解是注意到行和列翻转的效果可以通过考虑之间的差异来捕获`a`和`b`。 对于特定的单元格（i，j），经过几次翻转后，其最终值将是`a[i][j] XOR row_flip[i] XOR col_flip[j]`。 这个方程必须等于`b[i][j]`。 同样，对于每个单元格，我们有：```
row_flip[i] XOR col_flip[j] = a[i][j] XOR b[i][j]
```如果我们任意选择第一行的翻转，则列的翻转是唯一确定的。 然后剩余行的翻转必须满足相同的异或方程； 如果他们这样做了，转变就有可能。 这将问题简化为检查 XOR 方程组的一致性，这可以在 O(n^2) 内完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(2n) * n^2) | O(2^(2n) * n^2) | O(n^2) | O(n^2) | 太慢了|
 | 异或奇偶校验/建设性| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 计算一个新的矩阵`d`在哪里`d[i][j] = a[i][j] XOR b[i][j]`。 每个条目代表是否`a[i][j]`需要翻转奇数次才能匹配`b[i][j]`。 这将问题从矩阵运算转换为 XOR 约束系统。 
2.任意决定第一行的翻转，例如假设`row_flip[0] = 0`。 然后，对于每一列`j`，所需的列翻转可以计算为`col_flip[j] = d[0][j] XOR row_flip[0]`。 
3. 对于剩余的每一行`i > 0`，通过比较第一列来计算所需的行翻转：`row_flip[i] = d[i][0] XOR col_flip[0]`。 这可确保每行中的第一列与目标匹配。 
4. 验证所有其他条目是否满足 XOR 条件：`row_flip[i] XOR col_flip[j] == d[i][j]`。 如果任何细胞违反了这个方程，系统就会不一致，答案是“否”。 
5. 如果所有单元格都满足方程，则翻转序列存在，答案为“是”。 

为什么有效：一旦选择了第一行和第一列的翻转，就确定了其余的翻转。 XOR 系统保证每个单元要么一致，要么不一致。 这种方法检查所有一致性约束，而不需要显式尝试所有翻转序列。 任意选择`row_flip[0]`之所以有效，是因为翻转第一行始终可以与列翻转相结合； 如果存在解决方案，它将在以下任一选择下被发现`row_flip[0]`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = [list(map(int, list(input().strip()))) for _ in range(n)]
        input()  # skip empty line
        b = [list(map(int, list(input().strip()))) for _ in range(n)]
        
        # compute difference matrix
        d = [[a[i][j] ^ b[i][j] for j in range(n)] for i in range(n)]
        
        # assume first row flip = 0
        row_flip = [0] * n
        col_flip = [d[0][j] for j in range(n)]
        
        possible = True
        for i in range(1, n):
            row_flip[i] = d[i][0] ^ col_flip[0]
            for j in range(1, n):
                if row_flip[i] ^ col_flip[j] != d[i][j]:
                    possible = False
                    break
            if not possible:
                break
        print("YES" if possible else "NO")

if __name__ == "__main__":
    solve()
```该代码首先读取矩阵，计算它们的异或差，并初始化行和列翻转数组。 它将第一行设置为零并直接导出列翻转。 然后根据 XOR 约束检查剩余行。 如果发现任何不一致，答案为“否”； 否则，为“YES”。 跳过矩阵之间的空行可以避免输入读取中的未对齐。 使用列表理解可确保有效计算矩阵差异。 

## 工作示例

 **示例1**

 输入：```
3
3
110
001
110

000
000
000
```| 步骤| d[i][j] | d[i][j] 行翻转 | col_flip | 检查 |
 | ---| ---| ---| ---| ---|
 | 初始| 110 ^ 000 = 110 | 110 ^ 000 = 110 | row_flip[0]=0 | col_flip=[1,1,0] | col_flip=[1,1,0] | - |
 | 第 1 行 | d[1][0]=0，col_flip[0]=1 => row_flip[1]=1 | row_flip=[0,1,?] | row_flip=[0,1,?] col_flip=[1,1,0] | col_flip=[1,1,0] | 检查d[1][1]=0？ row_flip^col_flip=1^1=0 ， d[1][2]=1？ row_flip^col_flip=1^0=1 |
 | 第 2 行 | d[2][0]=1，col_flip[0]=1 => row_flip[2]=0 | row_flip=[0,1,0] | row_flip=[0,1,0] col_flip=[1,1,0] | col_flip=[1,1,0] | 检查d[2][1]=1？ 0^1=1 ， d[2][2]=0？ 0^0=0 | 0^0=0

 所有单元格满足异或条件，输出“YES”。 

**示例2**

 输入：```
2
01
11

10
10
```| 步骤| d[i][j] | d[i][j] 行翻转 | col_flip | 检查 |
 | --- | --- | --- | --- | --- |
 | 初始| 01^10=11, 11^10=01 | row_flip[0]=0 | col_flip=[1,1] | col_flip=[1,1] | 第1行检查：row_flip[1]=0^1=1，检查d[1][1]=1^1=0？ d[1][1]=1 | d[1][1]=1 |

 检测到不一致，输出“NO”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个测试用例都需要计算差异矩阵并验证每个单元一次。 |
 | 空间| O(n^2) | O(n^2) | 储存`a`,`b`， 和`d`矩阵。 行和列翻转使用 O(n) 额外空间。 |

 鉴于所有测试用例的 n 总和不超过 1000，操作总数低于 10^6，完全在时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("""3
3
110
001
110

000
000
000
3
101
010
101

010
101
010
2
01
11

10
10""") == "YES\nYES\nNO"

# Custom tests
# Minimum-size input
assert run("""1
1
0

1""") == "YES", "1x1, flip required"
assert run("""1
1
1

1""") == "YES", "1x1, no flip required"

#
```
