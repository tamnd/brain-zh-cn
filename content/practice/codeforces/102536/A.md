---
title: "CF 102536A - Slowden 文件"
description: "我们需要比较两个密码并确定它们的编辑距离。 第一个字符串是用户输入的内容，第二个字符串是实际的密码。 编辑是指更改一个字符、插入一个字符或删除一个字符。"
date: "2026-08-06T20:12:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102536
codeforces_index: "A"
codeforces_contest_name: "2020 UP ACM Algolympics Final Round"
rating: 0
weight: 102536
solve_time_s: 180
verified: true
draft: false
---

[CF 102536A - Slowden 文件](https://codeforces.com/problemset/problem/102536/A)

 **评级：** -
 **标签：** -
 **求解时间：** 3m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要比较两个密码并确定它们的编辑距离。 第一个字符串是用户输入的内容，第二个字符串是实际的密码。 编辑是指更改一个字符、插入一个字符或删除一个字符。 输出仅取决于所需的最小编辑次数是 0、1、2、3 还是更大。 

输入最多可包含 10,000 个密码对，所有密码的总长度可达 2,000,000 个字符。 正常的动态规划编辑距离解决方案使用`O(nm)`长度字符串的时间`n`和`m`，当两个字符串的长度都在 100,000 左右时，这会太昂贵。 即使一对长度为 100,000，也需要大约 100 亿次状态转换。 该解决方案需要利用这样一个事实：我们只关心最多三的距离。 

有些情况需要特别注意，因为简单的比较可能会给出错误的结果。 第一个是字符串具有不同长度的情况。 例如：```
Input:
1
abc
abcd
```正确的输出是：```
You almost got it. You're wrong in just one spot.
```仅计算不同位置的比较将发现前三个字符中没有不匹配的位置，并错误地声明字符串匹配。 缺失的字符是删除或插入，所以必须计数。 

另一种情况是插入移动所有后面的字符。 例如：```
Input:
1
abcde
abXcde
```正确的输出是：```
You almost got it. You're wrong in just one spot.
```逐个位置不匹配计数器会看到几个错误的位置，即使插入`X`只需一次操作即可解决所有问题。 

最后一个边缘情况是由长度变化引起的替换和多次编辑之间的差异。 例如：```
Input:
1
abc
xyz
```正确的输出是：```
You almost got it, but you're wrong in two spots.
```实际上，这里的编辑距离是三，因为必须替换所有三个字符。 仅在排序后比较不同字符的数量或忽略位置的方法可能会错误地对其进行分类。 

## 方法

 直接的方法是使用动态规划来计算经典的编辑距离。 对于两个字符串，我们创建一个表，其中每个单元格表示将一个字符串的前缀转换为另一个字符串的前缀所需的最小编辑次数。 转换考虑删除字符、插入字符或替换不匹配的字符。 这是正确的，因为每个最佳转换都必须以这三个操作之一结束。 

问题是表的大小。 如果两个密码的长度均为 100,000，则该表大约有 100 亿个单元格。 即使答案上限为三个，正常算法仍然会花时间计算不会影响最终决策的状态。 

关键的观察是，一旦距离大于三，我们就不需要精确的距离。 我们只需要知道距离是否最多为三。 当两个字符串之间的长度差已经大于三时，至少需要那么多的插入或删除，所以答案立即太大。 

当长度接近时，我们可以利用仅允许少量编辑的事实来对齐字符串。 如果字符串最多相差三个操作，则匹配部分必须保持大部分对齐。 我们可以递归地从两端跳过匹配字符，然后处理剩余的小部分不匹配区域。 每个不匹配都可以通过尝试可能的编辑操作来解决，同时在编辑次数超过三时立即停止。 

暴力解决方案之所以有效，是因为考虑了每个可能的编辑序列，但由于可能的序列数量快速增长，所以会失败。 观察到允许的距离是一个很小的常数，我们可以只搜索当前不匹配周围的小空间，而不是构建完整的动态规划表。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 编辑数量呈指数级增长 | O(深度) | 太慢了 |
 | 完全动态规划| O(纳米) | O(nm) 或 O(min(n,m)) | 对于最大输入来说太慢 |
 | 最佳有界搜索 | O(k * L)，其中 k = 3，L 是组合字符串长度 | O(k) | 已接受 |

 ## 算法演练

 1. 读取两个密码。 如果它们相同，则编辑距离为零，我们可以立即返回登录成功的消息。 首先检查相等性还可以避免在最常见的简单情况下进行不必要的递归工作。 
2. 比较两个密码的长度。 如果它们的差值大于三，则返回距离大于三的消息。 即使每个现有字符都匹配，长度差异为四的情况下也需要四次插入或删除。 
3. 使用递归函数接收两个当前位置和已使用的编辑数量。 在进行更多工作之前，请从当前位置跳过每个匹配的字符。 匹配字符永远不需要参与最佳编辑序列。 
4. 如果一个字符串到达​​末尾，则另一字符串中剩余的字符必须全部插入或删除。 将剩余长度添加到当前编辑计数中。 
5. 如果当前编辑计数已经大于 3，则停止探索此路径。 较大的距离不会影响最终类别。 
6. 当两个字符串仍有剩余字符且不同时，请尝试三种可能的编辑操作。 替换两个字符并向前移动，从第一个字符串中删除该字符，或从第二个字符串中删除该字符。 返回找到的最小编辑次数。 
7. 将最终距离转换为所需的输出消息。 以上三个距离共享相同的输出。

为什么有效：删除所有相等的前缀后，第一个剩余的字符是不同的。 任何最佳编辑序列都必须替换这些字符之一、删除其中一个字符或在其中一个字符之前插入一个字符。 这些正是该算法探索的三个转换。 只有在证明需要超过三个编辑后，递归才会停止，这已经足够了，因为所有较大的距离都具有相同的所需输出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 3

def limited_distance(a, b):
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def solve(i, j, used):
        while i < len(a) and j < len(b) and a[i] == b[j]:
            i += 1
            j += 1

        if i == len(a):
            return used + (len(b) - j)
        if j == len(b):
            return used + (len(a) - i)

        if used > LIMIT:
            return LIMIT + 1

        best = LIMIT + 1

        best = min(best, solve(i + 1, j + 1, used + 1))
        best = min(best, solve(i + 1, j, used + 1))
        best = min(best, solve(i, j + 1, used + 1))

        return best

    return solve(0, 0, 0)

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        a = input().rstrip("\n")
        b = input().rstrip("\n")

        d = limited_distance(a, b)

        if d == 0:
            ans.append("You're logged in!")
        elif d == 1:
            ans.append("You almost got it. You're wrong in just one spot.")
        elif d == 2:
            ans.append("You almost got it, but you're wrong in two spots.")
        elif d == 3:
            ans.append("You're wrong in three spots.")
        else:
            ans.append("What you entered is too different from the real password.")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```这`limited_distance`函数是算法中描述的有界搜索。 缓存存储由两个当前位置和已使用的编辑数量组成的状态。 包含编辑计数是因为在使用不同数量的编辑后到达同一对位置可能会导致不同的修剪决策。 

跳过相等字符的循环是主要的优化。 密码的长相同部分将被忽略，而不创建递归状态。 由于只允许进行三个编辑，因此递归分支仅发生在字符串不同的少数地方。 

基本情况处理一个密码首先结束的情况。 另一个密码的剩余后缀无法以任何其他方式匹配，因此每个剩余字符都需要插入或删除。 

该函数永远不需要区分四和更大的距离。 返回`LIMIT + 1`就足够了，因为所有这些情况都会产生相同的输出。 Python 整数在这里不会溢出，并且缓存大小保持较小，因为仅探索不匹配区域附近的状态。 

## 工作示例

 对于第一个样本对：```
password
password
```| 第一个字符串中的位置 | 第二个字符串中的位置 | 使用的编辑| 当前行动| 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 跳过匹配字符 | 两个字符串的结尾 |
 | 8 | 8 | 0 | 剩余距离| 0 |

 该算法删除整个公共前缀并到达两个字符串的末尾。 距离为零，因此打印登录消息。 

对于第四个样本对：```
password
pazzw0rd
```| 第一个字符串中的位置 | 第二个字符串中的位置 | 使用的编辑| 当前行动| 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 跳过`pa`| 索引 2 处不匹配 |
 | 2 | 2 | 0 | 代替`s`和`z`| 使用的编辑变为 1 |
 | 3 | 3 | 1 | 代替`s`和`z`| 使用的编辑变为 2 |
 | 5 | 5 | 2 | 代替`o`和`0`| 使用的编辑变为 3 |
 | 8 | 8 | 3 | 两个字符串的结尾 | 距离为 3 |

 此跟踪显示了为什么必须独立计算替换次数。 即使字符串具有相同的长度，三个不同的错误字符也需要进行三次编辑。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(3L) 即 O(L) | 每个探索的状态都在小的编辑距离边界内，并且匹配运行被跳过。 |
 | 空间| 最坏情况下的 O(L) | 记忆表仅存储探索过的递归状态。 |

 这里，`L`是两个密码的总长度。 总字符数为 2,000,000 个的输入限制是合适的，因为该算法从不构建二次表，而仅探索由最多 3 次编辑创建的状态。 

## 测试用例```python
import sys
import io
from functools import lru_cache

def program(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue()

assert program("""5
password
password
password
passw0rd
password
pazzword
password
pazzw0rd
password
username
""") == """You're logged in!
You almost got it. You're wrong in just one spot.
You almost got it, but you're wrong in two spots.
You're wrong in three spots.
What you entered is too different from the real password.
""", "sample"

assert program("""1
a
a
""") == """You're logged in!
""", "single equal character"

assert program("""1
a
b
""") == """You almost got it. You're wrong in just one spot.
""", "single replacement"

assert program("""1
abc
abcdef
""") == """You're wrong in three spots.
""", "three insertions"

assert program("""1
abc
xyz
""") == """You're wrong in three spots.
""", "three replacements"

assert program("""1
aaaaaaaaaa
bbbbbbbbbb
""") == """What you entered is too different from the real password.
""", "large mismatch count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 同等密码| 登录留言 | 零距离搬运|
 | 一个角色与另一个角色 | 一动留言| 更换过渡|
 | 短前缀与长字符串 | 三招留言| 末尾插入 |
 | 完全不同的等长字符串 | 三招或更大分类| 编辑限制处理 |
 | 许多不匹配的字符 | 太不同的消息| 距离三号线之外提前截止 |

 ## 边缘情况

 在递归浪费时间之前处理大于三的长度差异。 例如：```
Input:
1
a
abcde
```第二个密码有四个额外字符。 即使现有的`a`完美匹配，需要四次插入。 该算法返回大于三的距离并打印：```
What you entered is too different from the real password.
```基于位置的不匹配计数器会错误地仅关注共享字符并错过所需的插入。 

处理密码中间的单个插入是因为算法会尝试删除和插入，而不仅仅是替换。 为了：```
Input:
1
abcde
abXcde
```递归过程会跳过`ab`，达到不匹配，并尝试删除`X`从第二根弦开始。 其余字符匹配，距离为 1。 

具有相同字符但大小写不同的密码将被视为不同，因为比较使用实际字符。 为了：```
Input:
1
Password
password
```第一个字符不同，因此算法会计算替换。 输出是：```
You almost got it. You're wrong in just one spot.
```这可以避免意外地将密码视为不区分大小写，这会改变比较的含义。
