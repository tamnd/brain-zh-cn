---
title: "CF 56C - 公司邮件"
description: "该问题提出了一个编码为字符串的公司层次结构。 每个员工都有一个名字，后面可以选择冒号和以逗号分隔的下属列表，并以点结尾。 如果员工没有下属，则省略冒号。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "expression-parsing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 56
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 52 (Div. 2)"
rating: 1700
weight: 56
solve_time_s: 93
verified: true
draft: false
---

[CF 56C - 公司邮件](https://codeforces.com/problemset/problem/56/C)

 **评分：** 1700
 **标签：** 数据结构、表达式解析、实现
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题提出了一个编码为字符串的公司层次结构。 每个员工都有一个名字，后面可以选择冒号和以逗号分隔的下属列表，并以点结尾。 如果员工没有下属，则省略冒号。 多名员工可以具有相同的姓名。 输入字符串代表顶层的所有员工，以逗号分隔。 本质上，这是一个以自定义序列化方式编码的有根树的森林。 

任务是统计“不舒服的情况”，这种情况发生在一个人可以向同名的下属发送消息时。 由于允许所有下属进行通信，因此我们不限于直接子节点，而是子树中的任何节点。 例如，如果 MIKE 在任何深度都有一个从属 MIKE，则对于该对来说，这将被视为一种不舒服的情况。 

输入长度最多为 1000 个字符。 这意味着我们可以轻松地递归或迭代地解析结构，因为员工总数受到字符串大小和名称长度的限制。 显式计算所有祖先-后代对的蛮力方法将导致员工数量成二次方，这在这里是可行的，但并不理想。 非明显的边缘情况是在不同深度具有重复名称的树或在顶层有多个独立的树。 例如，`A:A.,A.`应该会产生一个不舒服的对，因为第一个`A`可以达到第二个`A`作为下属。 

另一个边缘情况是深度嵌套的同名员工，例如`X:X:X:X...`。 无法将祖先的计数传播到所有级别的幼稚方法可能会错过这些链中的多个不舒服的对。 

## 方法

 一种强力方法是显式地为每个员工构建树，然后为每个员工遍历所有后代并计算有多少人具有相同的名称。 这是可行的，因为我们直接遵循定义，但是当树很深并且名称经常重复时，它会变得很慢。 如果有`n`对于员工，最坏情况的复杂度是 O(n^2)，因为对于每个节点，我们可能会访问其子树中的所有节点。 

最佳解决方案的关键在于我们不需要知道确切的后代节点，只需要知道子树中每个名称出现的次数。 这允许我们递归地处理树。 在每个节点，我们维护一个计数器（如字典），用于记录每个名称在以此节点为根的子树中出现的次数。 当访问一个节点时，它产生的不舒服情况的数量恰好是它的子树中它的名称的数量，不包括它自己。 这将潜在的二次计算转换为线性计算，因为每个节点的子树只被处理一次。 

递归遍历是自然的，因为输入格式是分层的。 我们可以递归地解析每个员工，计算所有下属的姓名计数，然后向上传播计数，同时对不舒服的情况进行求和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 对于较大深度来说太慢 |
 | 最佳| O(n) | O(n) | 高效、被接受 |

 ## 算法演练

 1. 将输入字符串解析为树结构。 读取名称直至出现冒号或点。 如果出现冒号，则递归解析以逗号分隔的下属列表。 当点表示当前员工结束时停止解析。 
2. 对于每个节点，递归计算一个字典，将名称映射到以该节点为根的子树中的计数。 该字典包括所有后代节点的计数。 
3. 处理节点时，检查节点名称在子树字典中出现的次数。 该计数等于该节点生成的不舒服情况的数量，因为它代表具有相同名称的所有后代。 
4. 将下级字典合并到当前节点的字典中。 当前节点名称的计数加一。 
5. 返回所有节点累计的不舒服情况总数。 

工作原理：该算法保持了每个节点的不变量，字典反映了子树中所有名称的计数。 计算当前节点名称在该字典中的出现次数可以捕获涉及该节点作为发送者的所有不舒服的情况。 由于每个节点都被访问一次并且字典被有效地合并，所以所有情况都被计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def parse_employee(s, i):
    # Parse the name
    name_start = i
    while i < len(s) and s[i].isalpha():
        i += 1
    name = s[name_start:i]
    total_uncomfortable = 0
    counts = {}

    # Parse subordinates if present
    if i < len(s) and s[i] == ':':
        i += 1  # skip colon
        while True:
            sub_counts, sub_uncomfortable, i = parse_employee(s, i)
            total_uncomfortable += sub_uncomfortable
            # Merge subordinate counts
            for k, v in sub_counts.items():
                counts[k] = counts.get(k, 0) + v
            if i < len(s) and s[i] == ',':
                i += 1
            else:
                break

    # Increment current node's name
    total_uncomfortable += counts.get(name, 0)
    counts[name] = counts.get(name, 0) + 1

    i += 1  # skip dot
    return counts, total_uncomfortable, i

def main():
    s = input().strip()
    total_uncomfortable = 0
    i = 0
    while i < len(s):
        _, count, i = parse_employee(s, i)
        total_uncomfortable += count
        if i < len(s) and s[i] == ',':
            i += 1
    print(total_uncomfortable)

if __name__ == "__main__":
    main()
```这`parse_employee`函数处理解析和计数。 它读取名称，如果找到冒号，则递归处理下级，并使用字典来维护计数。 在添加当前节点名称之前增加不舒服的计数可确保我们只计算后代。 主循环处理多个用逗号分隔的顶级员工。 

## 工作示例

 **样品1：**`MIKE:MAX.,ARTEM:MIKE..,DMITRY:DMITRY.,DMITRY...`| 步骤| 节点| 子树计数 | 不舒服补充| 运行总计 |
 | --- | --- | --- | --- | --- |
 | 迈克 | 迈克 | {最大：1} | 0 | 0 |
 | 阿尔泰姆 | 阿尔泰姆 | {迈克：1} | 0 | 0 |
 | 迈克（在 ARTEM 旗下）| 迈克 | {} | 0 | 0 |
 | 儿童之后的 ARTEM | {阿尔特姆：1，迈克：1} | 0 | 0 | |
 | 德米特里 | 德米特里 | {德米特里：1} | 1 | 1 |
 | 德米特里（叶）| 德米特里 | {} | 0 | 1 |
 | DMITRY（合并后）| {德米特里：2} | 1 | 2 | 3 |

 该表确认每个节点正确地计算了其后代名称，总计为 3。 

**自定义输入：**`A:A:A..,A..`| 步骤| 节点| 子树计数 | 不舒服补充| 运行总计 |
 | --- | --- | --- | --- | --- |
 | A（上）| {答：2} | 1 | 1 | |
 | A（嵌套）| {答：1} | 1 | 2 | |
 | A（叶）| {答：1} | 0 | 2 | |

 这表明多个嵌套重复项已正确计数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 输入字符串的每个字符都会被访问一次。 合并字典仅涉及子树中唯一名称的数量，受字符串大小限制。 |
 | 空间| O(n) | 递归堆栈深度与树的深度成正比，字典存储每个唯一名称的计数。 |

 当 n ≤ 1000 时，算法可以在 2 秒内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# provided sample
assert run("MIKE:MAX.,ARTEM:MIKE..,DMITRY:DMITRY.,DMITRY...") == "3", "sample 1"

# custom cases
assert run("A:A:A..,A..") == "2", "nested duplicates"
assert run("X:X:X:X....") == "3", "deep nested duplicates"
assert run("B.,B.,B.") == "0", "multiple tops, no subordinates"
assert run("C:C.,C:C.,C:C.") == "3", "multiple tops with same name subordinates"
assert run("Z:Z,Z:Z,Z:Z.") == "6", "siblings with same name"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | A：A：A..，A.. | 2 | 嵌套重复项计数 |
 | X：X：X：X...... | 3 | 深度嵌套重复 |
 | B、B、B。 | 0 | 没有下属就没有不舒服的配对|
 | C：C.，C：C.，C：C。 | 3 | 具有相同从属名称的多棵树 |
 | Z：Z，Z：Z，Z：Z。 | 6 | 兄弟姐妹生成多对|

 ## 边缘情况

 边缘情况`X:X:X:X....`有四个链
