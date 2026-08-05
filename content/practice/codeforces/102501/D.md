---
title: "CF 102501D - 蛆猫"
description: "基因是一个短程序，可以修改极长氨基酸链的开头。 输入包含两个这样的程序，任务是确定它们在每个足够长的简单氨基酸链上是否始终表现相同。"
date: "2026-08-06T04:59:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102501
codeforces_index: "D"
codeforces_contest_name: "2019-2020 ICPC Southwestern European Regional Programming Contest (SWERC 2019-20)"
rating: 0
weight: 102501
solve_time_s: 1027
verified: true
draft: false
---

[CF 102501D - Gnalcats](https://codeforces.com/problemset/problem/102501/D)

 **评级：** -
 **标签：** -
 **求解时间：** 17m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 基因是一个短程序，可以修改极长氨基酸链的开头。 输入包含两个这样的程序，任务是确定它们在每个足够长的简单氨基酸链上是否始终表现相同。 

链条很大，所以我们无法构建真正的输入。 基因唯一可以触及的部分是链的有限前缀。 每个操作都通过删除、复制、交换、组合或拆分来操作前一个或两个氨基酸。 复杂氨基酸是二叉树，其子代是其他氨基酸。 

两个基因的总长度最多为 10000。这排除了尝试许多可能的输入蛋白质或重复扩展完整树的可能性。 解决方案需要在接近恒定的时间内处理每个操作。 每次操作后复制整个氨基酸结构的模拟会变得太慢，因为重复复制会使所表示的对象呈指数级增长。 

主要的边缘情况来自于将氨基酸视为值而不是身份以及忽略失败。 例如：```
L
R
```有答案`True`。 由于第一个氨基酸总是简单的，因此这两种操作在每种可能的输入上都会失败。 仅比较成功转换的粗心实施可能会错误地将它们报告为不同。 

另一个重要的例子是复杂氨基酸的结构相等。```
PU
SS
```有答案`True`。 这两个基因保持原始链不变。 中间的结构可以不同，但​​最终的二叉树必须按结构进行比较。 

最后一个陷阱是重复引用。```
C
P
```有答案`False`。 第一个基因转变`a-b-c-...`进入`a-a-b-c-...`，而第二个则产生复杂的氨基酸`<a,b>`。 仅比较叶子集合会错误地将它们视为相等。 

## 方法

 直接的方法是生成符号输入链，运行两个基因，然后比较生成的链。 这是正确的，因为输入总是由简单的氨基酸组成，因此有限的符号前缀可以代表每种可能的情况。 问题是选择前缀大小并有效地存储结构。 如果我们每次操作创建一个新的复杂氨基酸时都复制树，那么许多序列`C`和`P`操作可能会重复复制大型表达式。 

有用的观察是每个操作仅改变对氨基酸的引用。 复杂的氨基酸可以存储为包含两个子引用的节点。 创造`<a,b>`只创建一个新节点，相等的对可以通过实习共享同一个节点。 整个蛋白质变成了一堆节点标识符。 

基因长度还给出了所需初始前缀的界限。 在 10000 次操作中，该程序最多可以去除 10000 个顶级氨基酸。 从比这多几个开始意味着在模拟过程中永远不会出现因将链长度减少到三或更少而引起的特殊故障规则。 唯一剩下的失败是由应用引起的`L`,`R`， 或者`U`到堆栈表示检测到的简单氨基酸。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(L * 扩展树的大小) | O(扩展树的大小) | 太慢了|
 | 最佳 | O(L) | O(L) | 已接受 |

 ## 算法演练

 1. 为足够长的符号链中的每个初始简单氨基酸创建一个唯一的节点。 该链只需比基因可以执行的最大删除次数长，因为所有未受影响的后缀元素保持相同。 
2. 从左到右处理基因，同时将当前蛋白质存储为节点标识符堆栈。 堆栈的顶部代表链中的第一个氨基酸。 
3.为了`C`，复制顶部堆栈元素。 为了`D`，将其删除。 为了`S`，交换上面的两个元素。 这些操作仅重新排列引用，因此它们需要恒定的时间。 
4. 对于`P`，用其复杂组合替换前两个堆栈元素。 在表中查找这对子标识符，因此相同的复杂氨基酸总是收到相同的标识符。 
5. 对于`L`,`R`， 和`U`，检查顶部节点是否复杂。 如果很简单，基因就会失败。 否则，将顶部元素替换为所需的一个或多个子元素。 
6. 使用相同的初始符号链对两个基因运行相同的模拟。 如果一种模拟失败而另一种模拟成功，则基因是不同的。 如果两者都失败，则它们是等效的。 
7. 如果两者都成功，则逐个元素比较最终堆栈。 因为所有复杂节点都被固定，所以相同的标识符意味着相同的氨基酸结构。 

为什么有效：基因中的每个操作对堆栈表示的影响与对真实蛋白质链的影响完全相同。 唯一的区别是未改变的无限后缀由符号简单氨基酸的有限集合表示。 由于基因只能访问有界前缀，因此这种有限表示包含基因可以观察到的所有内容。 实习保留了结构平等，因此最终的比较符合基因等效性的定义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

pairs = {}
left = []
right = []
simple_count = 25050

nodes = [None]

for i in range(simple_count):
    nodes.append((0, i))

def get_complex(a, b):
    key = (a, b)
    if key not in pairs:
        pairs[key] = len(nodes)
        nodes.append((1, a, b))
    return pairs[key]

def run_gene(gene):
    stack = list(range(simple_count, 0, -1))

    for ch in gene:
        if ch == 'C':
            stack.append(stack[-1])
        elif ch == 'D':
            stack.pop()
        elif ch == 'S':
            stack[-1], stack[-2] = stack[-2], stack[-1]
        elif ch == 'P':
            a = stack.pop()
            b = stack.pop()
            stack.append(get_complex(a, b))
        elif ch == 'L':
            a = stack[-1]
            if nodes[a][0] == 0:
                return None
            stack[-1] = nodes[a][1]
        elif ch == 'R':
            a = stack[-1]
            if nodes[a][0] == 0:
                return None
            stack[-1] = nodes[a][2]
        elif ch == 'U':
            a = stack.pop()
            if nodes[a][0] == 0:
                return None
            stack.append(nodes[a][2])
            stack.append(nodes[a][1])

    return stack

def solve():
    a = input().strip()
    b = input().strip()

    x = run_gene(a)
    y = run_gene(b)

    if x is None or y is None:
        print("True" if x is None and y is None else "False")
    else:
        print("True" if x == y else "False")

solve()
```节点数组存储氨基酸的完整符号表示。 简单氨基酸由节点类型和唯一索引表示。 一个复杂的氨基酸存储了对其两个子氨基酸的引用。 

这`get_complex`功能是关键的实现细节。 如果没有实习，通过不同操作序列创建的两个相同的复杂树将需要递归比较。 Interning 将结构相等转换为整数相等。 

堆栈以相反的顺序初始化，因为列表的末尾是当前的第一个氨基酸。 这使得对蛋白质前面的每一个操作都变成了对`stack[-1]`。 

故障处理仅限于`L`,`R`， 和`U`。 链长度故障条件不会发生，因为模拟链的起始长度超过任何基因可以消耗的长度。 

## 工作示例

 对于第一个样本：```
PU
SS
```| 基因| 运营| 堆栈效应|
 | --- | --- | --- |
 | 聚氨酯| 普 | 将前两个氨基酸组合成`<a,b>`|
 | 聚氨酯| 你| 分裂`<a,b>`回到`a,b`|
 | SS | S | 交换前两个氨基酸 |
 | SS | S | 交换回来 |

 两者都以原始堆栈结束，所以答案是`True`。 

对于第二个样本：```
L
R
```| 基因| 运营| 结果 |
 | --- | --- | --- |
 | 左 | 检查第一个氨基酸 | 很简单，失败|
 | 右 | 检查第一个氨基酸 | 很简单，失败|

 这两种转换在每个有效输入上都会失败，因此它们是等效的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个基数都被处理一次，并且每个堆栈操作都是恒定时间。 |
 | 空间| O(n) | 最多创建线性数量的堆栈条目和复杂节点。 |

 操作总数受组合基因长度 10000 的限制，因此线性模拟很容易满足限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

assert run("PU\nSS\n") == "True\n", "sample 1"
assert run("L\nR\n") == "True\n", "sample 2"
assert run("U\nC\n") == "False\n", "sample 3"
assert run("PL\nPR\n") == "False\n", "sample 4"

assert run("C\nC\n") == "True\n", "same duplication"
assert run("D\nS\n") == "False\n", "different stack changes"
assert run("LLLL\nRRRR\n") == "True\n", "both always fail"
assert run("P\nP\n") == "True\n", "same complex creation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`C`与`C`| 真实| 相同的堆栈转换 |
 |`D`与`S`| 假 | 对前缀的不同影响 |
 |`LLLL`与`RRRR`| 真实| 失效等效|
 |`P`与`P`| 真实| 复杂节点创建与比较 |

 ## 边缘情况

 在比较最终堆栈之前处理两个基因总是失败的情况。 为了`L`和`R`，链的第一个符号始终是一个简单的氨基酸，因此模拟器立即返回失败。 该比较正确地将两个故障视为等效。 

通过不同路径创建相同结构的情况由实习映射处理。 复杂的氨基酸无法与创造它的历史进行比较。 它仅由其两个子标识符表示，因此两个相同的结构始终共享相同的标识符。 

重复增加堆栈大小的情况是通过使用引用而不是复制来处理的。 一长串`C`操作只会创建对同一节点的更多引用，因此内存使用量保持线性。
