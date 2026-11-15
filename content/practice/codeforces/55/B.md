---
title: "CF 55B - 最小数量"
description: "我们从棋盘上的四个整数开始。 我们还知道必须应用的三个运算的确切顺序，其中每个运算要么是加法，要么是乘法。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 55
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 51"
rating: 1600
weight: 55
solve_time_s: 107
verified: true
draft: false
---

[CF 55B - Smallest number](https://codeforces.com/problemset/problem/55/B)

 **评分：** 1600
 **标签：** 暴力破解
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从棋盘上的四个整数开始。 我们还知道必须应用的三个运算的确切顺序，其中每个运算要么是加法，要么是乘法。 At every step we may pick any two currently available numbers, apply the required operation to them, and place the result back onto the board. 经过 3 次操作后，只剩下一个数字。 

The task is to find the minimum possible final value.

 棘手的部分是，运算的顺序是固定的，但选择哪两个数字参与每个运算是完全灵活的。 不同的配对可以产生截然不同的结果。 

限制非常小。 只有四个数字，正好三个运算。 Even if we try every possible pairing at every step, the total number of states stays tiny. 在时限内暴力搜索是完全可行的。 

这些数字最多为 1000，因此中间产品可以轻松放入 64 位整数中。 The largest possible value appears when all numbers are 1000 and all operations are multiplication:$1000^4 = 10^{12}$这完全在 Python 的整数范围内。 

有几种边缘情况可能会默默地破坏不正确的实现。 

如果存在多个相等的值，我们仍然必须将它们视为单独的位置。 考虑：```
1 1 2 2
+ * +
```选择第一个`1`和第二个`1`与选择不同`1`和一个`2`。 使用集合的粗心实现会丢失有效状态。 

操作顺序无法重新排列。 例如：```
1 2 3 4
+ * *
```我们必须申请`+`第一的。 我们不允许在加法之前先乘法，即使这样会得到较小的答案。 

在每一步中，我们可以选择任何对，而不仅仅是相邻的元素。 例如：```
1 10 1 10
* + +
```最好的第一步是将两者相乘`1`s 以使结果保持较小。 将搜索限制在邻近元素会错过最佳答案。 

另一个微妙之处是，当存在零时，加法和乘法不可互换。 考虑：```
0 5 6 7
* + +
```最佳移动是乘法`0`和`7`立即生产`0`，这使得之后的总数保持较小。 仅基于当前最小值的贪婪策略可能会失败。 

## 方法

 最直接的解决办法就是暴力破解。 在每一步中，我们都会尝试当前可用数字中的每一个可能的对。 对于每一对，我们应用所需的操作，构建下一个状态，并继续递归。 

最初有 4 个数字，因此有：$\binom{4}{2}=6$可能的选择。 

一次操作后，还剩下 3 个数字，即：$\binom{3}{2}=3$选择。 

最后还剩下 2 个数字，所以只剩下 1 个选择。 

可能的执行路径总数为：$6 \times 3 \times 1 = 18$那是很小的。 即使是探索每种可能性的递归深度优先搜索也会立即运行。 

简单的暴力实现可以分别生成所有可能的括号和排列，但这很快就会变得混乱并重复状态。 更清晰的观察是游戏本身已经自然地定义了状态转换。 在每一步中，我们只需要当前的数字多重集和下一个操作的索引。 

这导致了紧凑的递归搜索：

 1. 选择两个指数。 
2. 应用当前操作。 
3. 在较小的列表上递归。 
4. 跟踪最小最终值。 

由于搜索树只有 18 个叶子，因此不需要剪枝或动态编程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 带有显式枚举的暴力破解 | O(4!× 括号) | O(1) | O(1) | 已接受 |
 | 递归状态搜索| O(18) | O(3) 递归深度 | 已接受 |

 ## 算法演练

 1. 读取四个初始整数和三个运算。 
2. 定义递归函数`dfs(arr, step)`在哪里`arr`是当前剩余号码的列表，并且`step`告诉我们接下来必须应用哪个操作。 
3.如果`arr`仅包含一个数字，由于所有操作都已完成，因此返回它。 
4. 否则，尝试每对索引`(i, j)`和`i < j`。 
5. 应用操作`ops[step]`到`arr[i]`和`arr[j]`。 

如果操作是`+`，计算它们的总和。 

如果操作是`*`，计算他们的乘积。 
6. Build the next array by removing the chosen pair and inserting the new result.

 The remaining numbers keep their values unchanged. The order does not matter logically, but keeping a consistent construction simplifies the implementation.
 7. 递归地计算下一个状态的最小可能结果。 
8. 在所有配对选择中取最小值。 
9. 打印递归搜索返回的最终答案。 

### 为什么它有效

 At every step the algorithm explores every legal move allowed by the problem statement. Any valid sequence of operations corresponds to exactly one path in the recursion tree. 由于递归会检查所有此类路径并返回其中的最小最终值，因此它不会错过最佳答案。 

递归深度正好为三，因为每一级都会消耗一次操作。 Eventually only one number remains, which is the final result produced by that particular sequence of choices.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

nums = list(map(int, input().split()))
ops = input().split()

def dfs(arr, step):
    if len(arr) == 1:
        return arr[0]

    best = float('inf')

    n = len(arr)

    for i in range(n):
        for j in range(i + 1, n):

            if ops[step] == '+':
                val = arr[i] + arr[j]
            else:
                val = arr[i] * arr[j]

            nxt = []

            for k in range(n):
                if k != i and k != j:
                    nxt.append(arr[k])

            nxt.append(val)

            best = min(best, dfs(nxt, step + 1))

    return best

print(dfs(nums, 0))
```递归函数直接反映了问题的过程。 当前数组代表仍然写在板上的数字，而`step`指示接下来必须使用哪个操作。 

当只剩下一个数字时，就会出现基本情况。 此时整个操作序列已经被应用，因此剩余的值是该分支的结果。 

嵌套循环枚举每个无序对。 使用`i < j`避免重复工作，因为选择`(a, b)`与选择相同`(b, a)`对于加法和乘法。 

下一个状态是精心构建的。 我们复制除两个选定的数字之外的所有数字，然后附加新计算的值。 这可以正确保留重复的数字。 使用集合或按值删除是危险的，因为相同的数字可能会出现多次。 

Python 整数自动处理大值，因此溢出不是这里的问题。 在具有固定宽度整数的语言中，64 位类型就足够了，因为最大可能值为$10^{12}$。 

## 工作示例

 ### 示例 1

 输入：```
1 1 1 1
+ + *
```最优路径的轨迹：

 | 步骤| 当前数字 | 运营| 已选对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | [1, 1, 1, 1] | + | 1, 1 | [1, 1, 2] |
 | 1 | [1, 1, 2] | + | 1, 1 | [2, 2] |
 | 2 | [2, 2] | * | 2, 2 | [4] |

 该路径给出 4，但它不是最佳的。 

另一条路：

 | 步骤| 当前数字 | 运营| 已选对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | [1, 1, 1, 1] | + | 1, 1 | [1, 1, 2] |
 | 1 | [1, 1, 2] | + | 1, 2 | [1, 3] |
 | 2 | [1, 3] | * | 1, 3 | [3] |

 可达到的最小值为 3。 

这个例子说明了为什么尝试所有配对都很重要。 尽管运算是固定的，但不同的中间分组会极大地改变最终的乘法。 

### 示例 2

 输入：```
0 5 6 7
* + +
```最优路径的轨迹：

 | 步骤| 当前数字 | 运营| 已选对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | [0,5,6,7]| * | 0, 7 | [5,6,0]|
 | 1 | [5,6,0]| + | 0, 5 | [6, 5] |
 | 2 | [6, 5] | + | 6, 5 | [11] |

 最终答案：11。 

如果我们乘以`6 * 7`首先，我们得到：

 | 步骤| 当前数字 | 运营| 已选对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | [0,5,6,7]| * | 6, 7 | [0, 5, 42] |
 | 1 | [0, 5, 42] | + | 0, 5 | [42, 5] |
 | 2 | [42, 5] | + | 42, 5 | [47]|

 这说明了为什么贪婪的局部决策是不可靠的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(18) | 第一步有6个选择，第二步有3个，第三步有1个|
 | 空间| O(3) | 递归深度永远不会超过 3 |

 搜索空间很小，因此程序基本上可以立即运行。 内存使用量也可以忽略不计，因为只有几个短数组同时存在。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    nums = list(map(int, input().split()))
    ops = input().split()

    def dfs(arr, step):
        if len(arr) == 1:
            return arr[0]

        best = float('inf')
        n = len(arr)

        for i in range(n):
            for j in range(i + 1, n):

                if ops[step] == '+':
                    val = arr[i] + arr[j]
                else:
                    val = arr[i] * arr[j]

                nxt = []

                for k in range(n):
                    if k != i and k != j:
                        nxt.append(arr[k])

                nxt.append(val)

                best = min(best, dfs(nxt, step + 1))

        return best

    print(dfs(nums, 0))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue().strip()

# provided sample
assert run("1 1 1 1\n+ + *\n") == "3", "sample 1"

# all zeros
assert run("0 0 0 0\n* * *\n") == "0", "all zeros"

# large values
assert run("1000 1000 1000 1000\n* * *\n") == "1000000000000", "large multiplication"

# duplicate values
assert run("1 1 2 2\n+ * +\n") == "5", "duplicate handling"

# operation order matters
assert run("1 2 3 4\n+ * *\n") == "14", "fixed operation order"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 0 0 / * * *`|`0`| 正确处理零 |
 |`1000 1000 1000 1000 / * * *`|`1000000000000`| 大中间值|
 |`1 1 2 2 / + * +`|`5`| 正确处理重复号码 |
 |`1 2 3 4 / + * *`|`14`| 操作必须保持给定的顺序 |

 ## 边缘情况

 考虑重复值的情况：```
1 1 2 2
+ * +
```该算法通过索引而不是值来处理数字。 在递归过程中它可以选择两者`1`s，或一个`1`和一个`2`，产生不同的未来状态。 由于每个索引对都是独立探索的，因此不会丢失任何有效配置。 

现在检查固定顺序约束：```
1 2 3 4
+ * *
```第一个递归级别始终适用`+`因为`step = 0`。 该算法从不首先考虑乘法。 一种最佳路径是：```
1 + 2 = 3
3 * 3 = 9
9 * 4 = 36
```但最小路径是：```
1 + 4 = 5
2 * 3 = 6
5 * 6 = 30
```递归保证检查所需顺序下的所有有效配对。 

最后，考虑零情况：```
0 5 6 7
* + +
```在第一级，该算法探索所有六种乘法选择。 一枝繁殖`0 * 7`，立即产生`0`。 后来的添加使总数保持较小，从而得到最佳答案 11。由于测试了每个可能的对，因此不能错过零的有益使用。
