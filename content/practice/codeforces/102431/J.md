---
title: "CF 102431J - 有线兼容协议缓冲区"
description: "protobuf 消息是一系列编码字段。 字段名称永远不会出现在线路上。 标识字段的是它的数字标签，连线类型告诉解码器有多少字节属于该字段。"
date: "2026-08-09T00:07:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "J"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 842
verified: true
draft: false
---

[CF 102431J - 有线兼容协议缓冲区](https://codeforces.com/problemset/problem/102431/J)

 **评级：** -
 **标签：** -
 **求解时间：** 14m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 protobuf 消息是一系列编码字段。 字段名称永远不会出现在线路上。 标识字段的是它的数字标签，连线类型告诉解码器有多少字节属于该字段。 在这个简化的问题中，`double`使用电线类型 1，同时两者`string`嵌入消息使用线路类型 2。 

为了使两个消息描述符能够兼容有线格式，它们必须接受完全相同类型的序列化字段序列。 这立即给我们提出了一些当地的要求。 具有特定标记的字段必须存在于两条消息中。 它的规则必须匹配，因为`required`,`optional`， 和`repeated`允许不同次数的出现。 其线电平类型也必须匹配。 一个`double`不能被字符串或消息替换，并且字符串不能被嵌入的消息替换，仅仅因为两者都使用线路类型 2。 

对于嵌入消息，还有一个条件。 假设两条消息都有一个编号为 3 的可选字段，其类型是另一条消息。 仅当两个嵌套消息类型本身兼容时，两个外部消息才兼容。 这将创建兼容性要求的递归图。 该图可能包含循环，如包含其自身类型的可选字段的消息所示。 

描述符以多个文本行的形式给出，后面跟着最多 50,000 个查询。 消息类型最多有1000种，每条消息最多包含16个字段。 消息数量少是关键限制。 它允许我们在消息数量上花费大约二次的时间，但是大量的查询意味着我们无法为每个查询执行新的昂贵的递归比较。 

查看消息的一种有用方法是作为带标签的有向图节点。 每个字段都是一个由其标签、规则和线路级别类型标记的传出边缘。 对于原始字段，边缘以固定终端类型结束，例如`string`或者`double`; 对于消息字段，它以另一个消息节点结束。 当两个消息节点的输出标记边匹配并且相应的消息边通向兼容节点时，这两个消息节点完全兼容。 

一些边缘情况很容易被错误处理。 

考虑具有相同标签的不同字段名称：```
message A {
optional string first = 1 ;
}
message B {
optional string second = 1 ;
}
2
A B
```正确的输出是：```
Wire-format compatible.
```比较字段名称的粗心解决方案会拒绝该对，但字段名称不会序列化。 

现在考虑具有不同标签的相同字段名称：```
message A {
optional string value = 1 ;
}
message B {
optional string value = 2 ;
}
1
A B
```正确的输出是：```
Wire-format incompatible.
```解码器通过数字标记查找字段，因此相同的名称没有帮助。 

字段规则也很重要：```
message A {
optional string value = 1 ;
}
message B {
repeated string value = 1 ;
}
1
A B
```正确的输出是：```
Wire-format incompatible.
```重复字段可能出现多次，而可选字段最多出现一次。 解码器无法将一种模式的每个有效实例解释为另一种模式的有效实例。 

最后，嵌入消息不能简单地视为字符串，因为两者都使用线类型 2：```
message Empty {
}
message Holder {
optional Empty value = 1 ;
}
message Text {
optional string value = 1 ;
}
1
Holder Text
```正确的输出是：```
Wire-format incompatible.
```字符串可以包含任意有效的 UTF-8 数据，而`Empty`必须是序列化的`Empty`消息，受到更多限制。 

1,000 条消息和每条消息 16 个字段的界限使得 (O(M^2F)) 预处理算法变得实用，其中 (M) 是消息数，(F) 是最大字段数。 在最大尺寸下，每个细化传递结构大约有 1600 万个字段级操作，而不是单独为 50,000 个查询执行类似的工作。 50,000 个查询限制恰恰排除了独立解决每个查询的可能性。 

## 方法

 直接的方法是递归比较两种消息类型。 首先比较它们的字段编号、规则和原始类型集。 每当双方都包含消息字段时，递归地比较两个引用的消息类型。 当描述符包含循环时，消息对的备忘录表可以防止无限递归。 

这是正确的，因为消息的兼容性完全由其相应字段的兼容性决定。 然而，这种比较的状态是一对消息类型，因此最多可以有 (M^2) 个不同的状态。 使用 (M=1000)，单个困难查询可以访问最多一百万个消息对。 每对最多 16 个字段，可能需要大约 1600 万次字段比较。 对 50,000 个查询重复此操作会产生大约 8000 亿次字段检查的最坏情况。 

暴力方法之所以有效，是因为兼容性关系是递归的，但它会失败，因为对于许多查询来说，可以独立地重新发现同一对消息类型。 解锁更快解决方案的观察结果是，兼容性是由每条消息的完整标记邻域确定的等价关系。 我们可以一次计算所有等价类。 

首先根据消息的直接线级结构将消息放入类中。 字段贡献它的标签、它的规则以及它的值是否是一个`double`, 一个`string`，或其他消息。 对于消息值字段，目标的身份将暂时被忽略。 

然后反复细化课程。 当一个字段指向另一条消息时，用其当前的类号替换目标消息。 仅当两个消息的字段具有相同的标签和规则、相同的基元类型并且它们对应的消息字段指向相同的当前类时，它们才保留在同一类中。 

这个过程就是分区细化。 每次迭代只能拆分类，而不能合并两个已经分离的消息。 只有 (M) 条消息，因此最多经过 (M-1) 条严格细化后，分区必须稳定。 此时，当两条消息有线格式兼容时，它们具有完全相同的类。 循环定义是自然处理的，因为每次迭代仅使用前一次迭代中计算的类。 

由于有 1,000 条消息，每条消息最多 16 个字段，即使是简单的细化实现也足够快。 经过预处理后，每个查询只是两个整数类标识符的比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(QM^2F)) 每个查询都有记忆的最坏情况 | 每个查询 (O(M^2)) | 太慢了|
 | 最佳 | (O(M^2F)) 最坏情况 | (O(MF)) | 已接受 |

 这里（M）是消息的数量，（F）是消息中的最大字段数，（Q）是查询的数量。 

## 算法演练

 1. 解析每条消息并为其分配一个整数 ID。 对于每个字段，存储其标签、规则和类型。 如果类型是其他消息，则存储引用的消息 ID。 
2. 将每条消息表示为按标签排序的字段。 源描述符可以以任何顺序列出字段，但字段顺序在 protobuf 序列化中没有意义，因此按标签排序为我们提供了规范的本地排序。 
3. 为每条消息赋予相同的初始类别。 我们一开始故意忽略嵌套消息类型的标识。 第一个改进将使用本地已经确定的所有内容来区分消息。 
4. 使用当前类为每条消息构建签名。 对于原始字段，签名包含其标签、规则和原始类型。 对于消息字段，它包含其标签、规则、表示它是消息的标记以及其目标的当前类。 
5. 为相等的签名分配相等的整数ID。 这些 ID 形成消息的新分区。 如果两条消息具有不同的签名，则它们无法兼容，因为某些字段级连线行为不同。 如果它们具有相同的签名，则它们仍然是兼容性的候选者。 
6. 重复签名构造，直到类分配停止变化。 每次细化要么分离至少一对先前相等的对，要么达到固定点。 由于只有 (M) 条消息，因此最多可以有 (M-1) 条严格细化。 
7. 对于每个查询，查找其两个消息名称的类 ID。 相同的 ID 意味着消息具有相同的递归定义的连线行为，因此打印`Wire-format compatible.`否则打印`Wire-format incompatible.`### 为什么它有效

 不变的是，在每次细化之后，不同类中的消息不能是有线格式兼容的。 标记、规则、原始连线类型或嵌套消息的当前类的差异给出了两个描述符可以接受的序列化数据的具体差异。 

当进程稳定时，同一类中的每对消息都有匹配的字段，并且每个相应的嵌套消息字段都指向同一个稳定类。 因此，这两个消息满足完全相同的递归兼容性条件。 相反，两个兼容消息永远不能通过细化来分开，因为兼容字段必须具有相同的标记、规则、原始类型或兼容的嵌套目标。 因此，稳定类正是有线格式兼容性类。 

使用以前的迭代类可以使循环安全。 例如，如果`A`包含一个可选的`A`，它的签名指的是类`A`从上一次迭代开始。 它不需要永远递归地扩展消息。 相互递归群，例如`B -> C -> B`当可观察到的线结构相同时，它们因此可以归为同一类。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    tokens = []

    for _ in range(n):
        tokens.extend(input().split())

    pos = 0
    messages = []
    name_to_id = {}

    while pos < len(tokens):
        assert tokens[pos] == "message"
        pos += 1

        name = tokens[pos]
        pos += 1

        mid = len(messages)
        name_to_id[name] = mid
        messages.append({
            "name": name,
            "fields": []
        })

        assert tokens[pos] == "{"
        pos += 1

        while tokens[pos] != "}":
            label = tokens[pos]
            typ = tokens[pos + 1]
            field_name = tokens[pos + 2]
            assert tokens[pos + 3] == "="
            tag = int(tokens[pos + 4])
            assert tokens[pos + 5] == ";"
            pos += 6

            messages[mid]["fields"].append(
                [tag, label, typ]
            )

        pos += 1

    # Resolve message type names to integer IDs.
    for msg in messages:
        fields = []
        for tag, label, typ in msg["fields"]:
            if typ == "double":
                fields.append((tag, label, 0, -1))
            elif typ == "string":
                fields.append((tag, label, 1, -1))
            else:
                fields.append((tag, label, 2, name_to_id[typ]))

        fields.sort(key=lambda x: x[0])
        msg["fields"] = fields

    m = len(messages)

    # Initially all messages are in one class.
    cls = [0] * m

    while True:
        signatures = []

        for msg in messages:
            sig = []

            for tag, label, kind, target in msg["fields"]:
                if kind == 2:
                    sig.append((tag, label, kind, cls[target]))
                else:
                    sig.append((tag, label, kind))

            signatures.append(tuple(sig))

        ids = {}
        new_cls = [0] * m

        for i, sig in enumerate(signatures):
            if sig not in ids:
                ids[sig] = len(ids)
            new_cls[i] = ids[sig]

        if new_cls == cls:
            break

        cls = new_cls

    q = int(input())
    out = []

    for _ in range(q):
        a, b = input().split()

        if cls[name_to_id[a]] == cls[name_to_id[b]]:
            out.append("Wire-format compatible.")
        else:
            out.append("Wire-format incompatible.")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```解析器首先从第一个开始读取所有描述符标记`n`线。 这很方便，因为根据输入格式，大括号、分号、字段名称和类型名称已经用空格分隔。 因此，字段在其标签开始后始终恰好占据六个标记。 

第一种表示将消息类型名称保留为字符串，以便可以在解析引用之前注册所有消息名称。 解析完成后，每个消息引用都会转换为整数 ID。 这避免了细化循环期间的字典查找。 

这些字段按标签排序。 这是必要的，因为描述符顺序不会影响有线格式。 如果不进行排序，两个完全相同的消息可能会收到不同的签名，仅仅是因为它们的声明出现的顺序不同。 

整数`kind`区分三种可能的字段值类别。`0`代表`double`,`1`代表`string`， 和`2`代表嵌入的消息。 消息字段包括其目标的当前类，而原始字段没有目标类。 

细化循环从零类中的每条消息开始。 在每次迭代中，每条消息都会收到一个完整的签名，描述其当前可观察的结构。 相同的签名会收到相同的类 ID。 如果新的类数组与前一个类数组相同，则分区已达到固定点。 

比较`new_cls == cls`是安全的，因为类 ID 是通过按 ID 顺序扫描消息来确定分配的。 如果分区没有改变，相应的签名也没有改变，所以另一次迭代不能改进任何东西。 

Python 中不存在整数溢出问题。 字段编号可以大到 536,870,911，这很容易用 Python 整数处理。 最大字段数仅为 16，因此每个签名仍然很小。 

查询阶段故意变得琐碎。 所有递归工作都已在预处理期间执行，因此最多 50,000 个查询中的每个查询都需要恒定时间。 

## 工作示例

 ### 示例 1

 相关的消息结构是：```
Test1:       tag 1, optional, string
Test2:       tag 1, optional, string
Test3:       tag 2, optional, string
Test4:       tag 1, required, string
StringMessage: tag 1, optional, string
Test5:       tag 1, optional, message StringMessage
```细化状态可以总结如下。 确切的数字类 ID 取决于分配签名的顺序，但 ID 之间的相等性才是最重要的。 

| 迭代| 留言 | 标志性形状 | 班级 |
 | --- | --- | --- | --- |
 | 初始| 测试1 | 所有消息最初都是相等的 | 0 |
 | 初始| 测试2 | 所有消息最初都是相等的 | 0 |
 | 初始| 测试3 | 所有消息最初都是相等的 | 0 |
 | 初始| 测试4 | 所有消息最初都是相等的 | 0 |
 | 初始| 字符串消息 | 所有消息最初都是相等的 | 0 |
 | 初始| 测试5 | 所有消息最初都是相等的 | 0 |
 | 1 | 测试1 |`(1, optional, string)`| 0 |
 | 1 | 测试2 |`(1, optional, string)`| 0 |
 | 1 | 测试3 |`(2, optional, string)`| 1 |
 | 1 | 测试4 |`(1, required, string)`| 2 |
 | 1 | 字符串消息 |`(1, optional, string)`| 0 |
 | 1 | 测试5 |`(1, optional, message, class(Test1))`| 3 |
 | 2 | 测试1 | 不变| 0 |
 | 2 | 测试2 | 不变| 0 |
 | 2 | 测试3 | 不变| 1 |
 | 2 | 测试4 | 不变| 2 |
 | 2 | 字符串消息 | 不变| 0 |
 | 2 | 测试5 | 不变| 3 |

 查询结果给出`Test1`和`Test2`同一个班级，同时`Test3`,`Test4`， 和`Test5`各有不同。 即使字段名称不同，第一个查询也是兼容的，因为名称从未出现在签名中。 

### 示例 2

 这里的嵌套结构是：```
A -> B -> C
D -> E
C and E are empty
```细化过程的行为如下。 

| 迭代| 留言 | 现场签名 | 班级 |
 | --- | --- | --- | --- |
 | 1 | 一个 |`(1, optional, message, 0)`| 0 |
 | 1 | 乙|`(1, optional, message, 0)`| 0 |
 | 1 | C | 空 | 1 |
 | 1 | d |`(1, optional, message, 0)`| 0 |
 | 1 | 电子| 空 | 1 |
 | 2 | 一个 |`(1, optional, message, 0)`| 0 |
 | 2 | 乙|`(1, optional, message, 1)`| 1 |
 | 2 | C | 空 | 2 |
 | 2 | d |`(1, optional, message, 1)`| 1 |
 | 2 | 电子| 空 | 2 |
 | 3 | 一个 |`(1, optional, message, 1)`| 0 |
 | 3 | 乙|`(1, optional, message, 2)`| 1 |
 | 3 | C | 空 | 2 |
 | 3 | d |`(1, optional, message, 2)`| 1 |
 | 3 | 电子| 空 | 2 |`B`和`D`最终收到相同的类，因为两者都包含相同的可选消息字段，其目标是空消息。`A`是不同的，因为它是嵌套的`B`不等于空消息。 

这给出了两个请求的答案：```
B D
```是兼容的，同时```
A D
```不兼容。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(M^2F + Q)) | 最多（M-1）个严格细化，每次扫描（M）条消息和最多（F）个字段，然后进行常量时间查询 |
 | 空间| (O(MF)) | 每条消息的描述符和一个签名最多包含 (MF) 字段条目 |

 对于 (M \le 1000) 和 (F \le 16)，在所有可能的细化迭代中，预处理范围最多约为 1600 万个字段条目。 查询阶段处理 50,000 个查询，每个查询仅进行两次数组查找，因此大量查询计数不会改变渐近预处理成本。 

## 测试用例```python
import sys
import io

def solve_text(inp: str) -> str:
    data = inp.split()
    p = 0

    n = int(data[p])
    p += 1

    messages = []
    name_to_id = {}

    for _ in range(n):
        assert data[p] == "message"
        p += 1

        name = data[p]
        p += 1

        mid = len(messages)
        name_to_id[name] = mid
        messages.append([])

        assert data[p] == "{"
        p += 1

        while data[p] != "}":
            label = data[p]
            typ = data[p + 1]
            p += 2

            p += 1  # field name

            assert data[p] == "="
            p += 1

            tag = int(data[p])
            p += 1

            assert data[p] == ";"
            p += 1

            messages[mid].append((tag, label, typ))

        p += 1

    for i in range(len(messages)):
        converted = []

        for tag, label, typ in messages[i]:
            if typ == "double":
                converted.append((tag, label, 0, -1))
            elif typ == "string":
                converted.append((tag, label, 1, -1))
            else:
                converted.append((tag, label, 2, name_to_id[typ]))

        converted.sort()
        messages[i] = converted

    m = len(messages)
    cls = [0] * m

    while True:
        groups = {}
        new_cls = [0] * m

        for i in range(m):
            sig = []

            for tag, label, kind, target in messages[i]:
                if kind == 2:
                    sig.append((tag, label, kind, cls[target]))
                else:
                    sig.append((tag, label, kind))

            sig = tuple(sig)

            if sig not in groups:
                groups[sig] = len(groups)

            new_cls[i] = groups[sig]

        if new_cls == cls:
            break

        cls = new_cls

    q = int(data[p])
    p += 1

    ans = []

    for _ in range(q):
        a = data[p]
        b = data[p + 1]
        p += 2

        if cls[name_to_id[a]] == cls[name_to_id[b]]:
            ans.append("Wire-format compatible.")
        else:
            ans.append("Wire-format incompatible.")

    return "\n".join(ans)

def run(inp: str) -> str:
    return solve_text(inp)

sample1 = """18
message Test1 {
optional string field = 1 ;
}
message Test2 {
optional string field_string = 1 ;
}
message Test3 {
optional string field = 2 ;
}
message Test4 {
required string field = 1 ;
}
message StringMessage {
optional string field = 1 ;
}
message Test5 {
optional StringMessage field = 1 ;
}
4
Test1 Test2
Test1 Test3
Test1 Test4
Test1 Test5
"""

assert run(sample1) == """Wire-format compatible.
Wire-format incompatible.
Wire-format incompatible.
Wire-format incompatible.""", "sample 1"

sample2 = """5
message A { optional B nest = 1 ; }
message B { optional C nest = 1 ; }
message C { }
message D { optional E nest = 1 ; }
message E { }
2
B D
A D
"""

assert run(sample2) == """Wire-format compatible.
Wire-format incompatible.""", "sample 2"

sample3 = """1
message A { }
1
A A
"""

assert run(sample3) == """Wire-format compatible.""", "minimum empty message"

sample4 = """3
message A {
optional string x = 536870911 ;
}
message B {
optional string y = 536870911 ;
}
message C {
optional string z = 536870910 ;
}
3
A B
A C
B C
"""

assert run(sample4) == """Wire-format compatible.
Wire-format incompatible.
Wire-format incompatible.""", "maximum field number"

sample5 = """2
message A {
repeated string a = 1 ;
repeated string b = 2 ;
repeated string c = 3 ;
repeated string d = 4 ;
}
message B {
repeated string x = 1 ;
repeated string y = 2 ;
repeated string z = 3 ;
repeated string w = 4 ;
}
2
A B
A A
"""

assert run(sample5) == """Wire-format compatible.
Wire-format compatible.""", "all matching repeated fields"

# A larger generated case, close to the maximum number of messages.
parts = ["1000"]
for i in range(1000):
    parts.append(
        f"message M{i} {{ optional string value = 1 ; }}"
    )
parts.append("3")
parts.append("M0 M999")
parts.append("M123 M456")
parts.append("M0 M0")

large_input = "\n".join(parts) + "\n"

assert run(large_input) == """Wire-format compatible.
Wire-format compatible.
Wire-format compatible.""", "large descriptor"

# Recursive cycle case.
cycle_input = """3
message A { optional A next = 1 ; }
message B { optional C next = 1 ; }
message C { optional B next = 1 ; }
3
A B
A C
B C
"""

assert run(cycle_input) == """Wire-format compatible.
Wire-format compatible.
Wire-format compatible.""", "recursive cycles"
```最小大小情况检查空描述符主体是否生成具有空签名的普通消息，并且消息始终与其自身兼容。 

最大标签情况检查最大合法字段编号是否被视为普通整数，并且将其更改为 1 会更改线路级字段标识。 

所有重复的情况会检查字段名称是否被忽略，以及当声明使用完全不同的名称时重复的规则是否保持兼容。 

生成的 1,000 条消息案例运用最大的消息计数维度，并验证预处理是否为所有结构相同的消息生成一个类。 

递归循环案例检查了使用迭代细化而不是朴素递归扩展的核心原因。 即使嵌套消息定义没有有限扩展，该算法也会达到稳定的分区。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`message A { }`， 询问`A A`| 兼容| 空消息和最小描述符 |
 | 标签`536870911`相对`536870910`| 兼容，然后不兼容 | 最大合法字段数和标签敏感度 |
 | 具有四个重复字符串字段的两条消息 | 兼容| 忽略字段名称并保留重复规则 |
 | 1,000 条结构相同的消息 | 所有查询对兼容 | 最大消息计数和预处理 |
 | 三个相互递归的消息| 所有三对兼容 | 循环消息参考|

 ## 边缘情况

 通过从每个签名中排除字段名称来处理不同的字段名称。 为了```
message A { optional string first = 1 ; }
message B { optional string second = 1 ; }
```两条消息产生完全相同的签名，`(1, optional, string)`，所以他们进入同一个班级。 该算法正确遵循有线格式而不是描述符的源级名称。 

不同的标签由每个字段签名的第一个元素直接处理。 为了```
message A { optional string value = 1 ; }
message B { optional string value = 2 ; }
```签名是`(1, optional, string)`和`(2, optional, string)`。 它们在第一次精炼时是分离的，以后永远不可能兼容。 

不同的规则同样可见，无需查看嵌套消息内部。 可选字段贡献`optional`其签名，而重复字段则贡献`repeated`。 最后```
message A { optional string value = 1 ; }
message B { repeated string value = 1 ; }
```立即分开。 这避免了仅检查标签和电线类型而忘记多重性的常见错误。 

字符串和嵌入消息都使用线路类型 2，但签名保留了两者之间的区别`string`和`message`。 消息字段还携带其嵌套目标的当前类。 因此，诸如以下的声明```
message Empty { }
message Holder { optional Empty value = 1 ; }
message Text { optional string value = 1 ; }
```给出`Holder`消息值字段和`Text`字符串值字段，因此即使它们的线路类型号都是 2，它们也会收到不同的类。 

在 Python 实现中，递归定义的处理无需递归。 为了```
message A { optional A next = 1 ; }
```第一次细化看到共同的形状`(1, optional, message, 0)`。 随后的迭代继续看到相同的目标类，因此分区稳定下来。 该算法从不尝试构建无限嵌套的表示`A`。 

相互递归定义的工作原理相同。 在```
message B { optional C next = 1 ; }
message C { optional B next = 1 ; }
```两个目标最初属于同一类别。 因此，他们的签名保持相同，并且在每一次改进中都保持在一起。 不动点直接捕获递归等价，而不需要特殊的循环检测情况。
