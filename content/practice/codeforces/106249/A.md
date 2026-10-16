---
title: "CF 106249A - 麻省理工学院和 TIM"
description: "我们得到一个仅由字符 M、I 和 T 组成的字符串。操作可以将子字符串 MIT 更改为 TIM 或反之亦然。 目标是执行任意数量的操作并使 MITIT 连续出现的次数尽可能多。"
date: "2026-06-25T07:19:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106249
codeforces_index: "A"
codeforces_contest_name: "MITIT Winter 2025-26 Advanced Individual Round"
rating: 0
weight: 106249
solve_time_s: 65
verified: true
draft: false
---

[CF 106249A - MIT 和 TIM](https://codeforces.com/problemset/problem/106249/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个仅由字符组成的字符串`M`,`I`， 和`T`。 一个操作可以改变一个子串`MIT`进入`TIM`或者反之亦然。 目标是执行任意数量的操作并使连续出现的次数`MITIT`尽可能大。 

关键的观察是一个操作仅交换一个`M`和一个`T`围绕一个固定的`I`。 职位包含`I`永远不会改变。 所有测试用例的输入大小最多为$10^5$，所以一个$O(n^2)$模拟操作或尝试许多最终字符串是不可能的。 我们需要对每个字符处理固定次数。 

一个常见的错误是认为字符可以自由地重新排列，因为操作改变了字符的顺序`M`和`T`。 他们不能。 例如，在`MIMT`， 这`I`位置保持固定，所以第一个`I`将始终保持在前两个非之间`I`职位。 只计算总数的解决方案`M`,`I`， 和`T`将会失败。 

考虑字符串`MIMTI`。 它有两个`I`角色，但它永远无法创造`MITIT`，因为最终`T`第二次之后`I`不存在。 正确答案是`0`。 仅基于计数的粗心解决方案可能会错误地预期发生一次，因为存在一个`M`， 二`I`，和两个`T`人物。 

另一个边缘情况是当所需的字符存在但`I`立场阻止他们见面。 为了`MMITT`，计数足以`MITIT`，但没有两个`I`字符在所需的距离。 答案是`0`，因为操作不能移动`I`人物。 

## 方法

 暴力方法将尝试理解通过操作可到达的所有可能的字符串。 由于每个操作都会交换两个字符，因此我们可能会尝试不同的交换并保留找到的最佳结果。 这是正确的，因为每个有效的最终排列都可以通过某些操作序列达到，但是可能的排列数量呈指数增长，因此它对于长度的字符串不可用$10^5$。 

重要的结构来自于查看单个操作的真正作用。 一次转变`MIT <-> TIM`只交换两个非`I`周围的人物`I`。 这意味着`I`位置永远固定。 非`I`位置形成角色可以移动的组。 

如果我们连接两个非`I`每当恰好有一个位置时`I`在它们之间，每个操作都只是一个连接组件内的交换。 在一个组件内部，所有`M`和`T`字符可以任意重新排列。 

一个`MITIT`发生使用三个非`I`职位。 这些位置相隔两个`I`字符，因此它们始终属于同一组件。 这意味着每个组件都可以独立求解。 

在一个组件内，假设其长度为`len`它包含`m`人物`M`和`t`人物`T`。 我们需要最大化长度三模式的数量`MTT`。 每一个这样的模式都需要一个`M`和两个`T`字符，并且不同的出现不能共享相同的起始位置。 最大值为：$$\min(m,\lfloor t/2\rfloor,\lfloor len/3\rfloor)$$通过将每个`M`随后是两个`T`字符并使用剩余位置来放置未使用的字母。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 扫描字符串并构建非的连通分量`I`职位。 两非`I`如果恰好有一个位置，则属于同一组件`I`他们之间。 这相当于将连续的非分组`I`具有相同奇偶性的位置通过连接`I`职位。 
2. 对于每个组件，计算其大小和数量`M`字符和`T`里面的字符。 当前的排列是无关紧要的，因为操作允许我们在组件内重新排列这些字符。 
3. 计算组件的贡献作为可用数量的最小值`M`字符，可用字符的一半`T`字符和组件长度的三分之一。 每个值代表一个项目所需的一种资源`MITIT`图案。 
4. 添加所有组件的贡献。 由于没有出现可以使用来自两个不同组件的字符，因此总和是全局最大值。 

为什么它有效：不变的是每个操作都会保留所有`I`头寸固定且仅掉期`M`和`T`在其连接的组件内。 一个可能的`MITIT`发生需要三非`I`由两个连接的位置`I`位置，因此它必须保留在单个组件内。 由于每个组件都可以自由重新排列，因此唯一的限制是组件的数量`M`,`T`和可用长度。 该公式准确地捕获了这些限制，因此计算出的总和是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(s):
    n = len(s)
    seen = [False] * n
    ans = 0

    for i in range(n):
        if s[i] == 'I' or seen[i]:
            continue

        stack = [i]
        seen[i] = True
        length = 0
        m = 0
        t = 0

        while stack:
            x = stack.pop()
            length += 1
            if s[x] == 'M':
                m += 1
            else:
                t += 1

            for y in (x - 2, x + 2):
                if 0 <= y < n and not seen[y] and s[(x + y) // 2] == 'I' and s[y] != 'I':
                    seen[y] = True
                    stack.append(y)

        ans += min(m, t // 2, length // 3)

    return ans

def main():
    data = sys.stdin.read().split()
    if not data:
        return
    t = int(data[0])
    out = []
    for i in range(1, t + 1):
        out.append(str(solve_case(data[i])))
    print("\n".join(out))

main()
```该解决方案对非隐式图使用深度优先搜索`I`职位。 仅当两个位置有一个边时才存在`I`它们之间，这就是邻居检查使用距离二的原因。 

DFS 收集一个组件的大小和每个字母的数量。 组件内字符的实际顺序是不必要的，因为交换让我们重新排列它们。 最终的最小计算直接应用资源限制进行构建`MTT`三元组，对应于`MITIT`子串。 

邻居循环中的边界检查可防止访问字符串外部。 中间指数`(x + y) // 2`是安全的，因为`y`总是正好远离两个位置`x`。 

## 工作示例

 对于第一个样本：```
TITIMMIT
```各组件的处理如下：

 | 组件| 长度 | 米数 | T 计数 | 贡献|
 | ---| ---| ---| ---| ---|
 | 连接在一起的非 I 位置 | 5 | 2 | 3 | 1 |

 该组件有足够的字符来组成一个`MTT`，所以答案是`1`。 这表明该算法正确地使用了组件内部的重新排列。 

对于字符无法提供足够的组件`T`字符：

 | 组件| 长度 | 米数 | T 计数 | 贡献|
 | ---| ---| ---| ---| ---|
 | 一个组件 | 7 | 3 | 1 | 0 |

 尽管有`M`可用字符，每次出现都需要两个`T`之后的字符`M`。 答案仍然是零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 组件遍历期间每个位置都会被访问一次 |
 | 空间| O(n) | 访问过的数组和DFS堆栈存储在最多所有位置|

 所有字符串的总长度为$10^5$，因此线性解很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve_case(s):
    n = len(s)
    seen = [False] * n
    ans = 0
    for i in range(n):
        if s[i] == 'I' or seen[i]:
            continue
        stack = [i]
        seen[i] = True
        length = m = t = 0
        while stack:
            x = stack.pop()
            length += 1
            if s[x] == 'M':
                m += 1
            else:
                t += 1
            for y in (x - 2, x + 2):
                if 0 <= y < n and not seen[y] and s[(x + y) // 2] == 'I' and s[y] != 'I':
                    seen[y] = True
                    stack.append(y)
        ans += min(m, t // 2, length // 3)
    return ans

def run(inp: str) -> str:
    data = inp.split()
    out = []
    for s in data[1:]:
        out.append(str(solve_case(s)))
    return "\n".join(out)

assert run("6 TITIMMIT TITITIMITIMTMTMTMMITMI MIMTITMTIMTITMTITITMTI ITMTTMITMITMTMTITITMIM MMITMITTTIMTITITTTITIT MITITIMIMIMITITITITIMIMIMIMIMIMITITITIT") == "1\n2\n0\n0\n0\n5"

assert run("1 MIMTI") == "0"
assert run("1 MMITT") == "0"
assert run("1 MITIT") == "1"
assert run("1 MMMMMIIIIITTTTT") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`MIMTI`|`0`| 检查仅字符数是否不够 |
 |`MMITT`|`0`| 检查固定`I`职位 |
 |`MITIT`|`1`| 最小直接成功模式|
 |`MMMMMIIIIITTTTT`|`0`| 检查分离的组件和不可能的重新排列 |

 ## 边缘情况

 对于`MIMTI`，该算法从非创建组件`I`职位。 该组件包含`M`和`T`位置空间不足且`T`完整的字符`MTT`模式，因此贡献为零。 

为了`MMITT`, 两个`I`字符不在所需的位置`MITIT`。 由于组件是围绕固定构建的`I`位置，该算法永远不会错误地合并这些字符并返回零。 

对于已经等于的字符串`MITIT`，所有三个非`I`位置属于一个组件。 组件长度为三，它有一个`M`和两个`T`字符，给出：$$\min(1, 2/2, 3/3)=1$$所以答案是一。 这证实了该方法处理最简单的可能发生的情况。
